"""
Commands service
"""
# pylint: disable=undefined-variable

import traceback
import logging
import time
import sys
import os
import getpass

from agent import ioc, wtransaction, ServerException, InvalidUserInputException
from agent.models import Progress, Command
from agent.commands import CommandResult, DelayCommandResult


def create_progress(command, result):
    """
    Create progress from command and result
    """
    progress = Progress()
    progress.set_value("commandId", command.get_value("commandId"))
    progress.set_value("taskId", command.get_value("taskId"))
    progress.set_value("stageId", command.get_value("stageId"))
    progress.set_value("description", result.description)
    progress.set_value("completed", result.completed)
    progress.set_value("failed", result.failed)
    if result.payload is not None:
        progress.set_value("payload", result.payload)
    return progress


class CommandsService(ioc.Component):
    """Commands Service
    """

    def __init__(self):
        self._repository = \
            ioc.repositories.commands_repository()
        self._prepository = \
            ioc.repositories.progress_repository()
        self._tasks_repository = \
            ioc.repositories.tasks_repository()
        self._event_aggregator = \
            ioc.components.event_aggregator()
        self._secure_storage = \
            ioc.services.secure_storage()
        self._user_context = ioc.components.user_context()
        self._executor = ioc.commands.executor()
        self._logger = logging.getLogger(self.__class__.__name__)

    def get_running_commands(self):
        """Get all commands in running state
        """
        return self._repository.get_all(query={"state": "running"})

    def get_incomplete_commands(self, command_type):
        """Get all incomplete commands
        """
        query = {
            "type": command_type,
            "$or": [{"state": "new"}, {"state": "delayed"}, {"state": "running"}, {"state": "interactive"}]
        }
        return self._repository.get_all(query=query)

    def get_next_command(self, taskid=None, interactive=False):
        """Get next new command for execution
        """
        query = {"executeAfter": {"$lte": time.time()}}
        if taskid is not None:
            query["taskId"] = taskid

        if interactive is True:
            query["state"] = "interactive"
        elif interactive is False:
            query["$or"] = [{"state": "new"}, {"state": "delayed"}]
        else:
            query["$or"] = [{"state": "new"}, {"state": "delayed"}, {"state": "interactive"}]

        commands = self._repository.get_all(query=query,
                                            limit=1,
                                            sort=(("executeAfter", 1),))
        if commands:
            return commands[0]
        return None

    def get(self, command_id):
        """Get command by id
        """
        return self._repository.get(command_id)

    @wtransaction
    def start_command_execution(self, command):
        """Start command execution
        """
        assert command
        command.set_value("state", "running")
        self._repository.update(command)

    @wtransaction
    def report_progress(self, command, result):
        """Report progress of command execution
        """
        assert command
        assert result
        progress = None
        if isinstance(result, CommandResult):
            progress = create_progress(command, result)
            self._prepository.insert(progress)
            if result.failed:
                command.set_value("state", "failed")
            elif result.completed:
                command.set_value("state", "completed")
        elif isinstance(result, DelayCommandResult):
            command.set_value("executeAfter", time.time() + result.delay)
            command.set_value("state", "delayed")
        else:
            raise ServerException(fmt="Unexpected command result type")

        self._repository.update(command)

        if isinstance(result, CommandResult):
            self._event_aggregator.raise_event("NewProgress")

        return progress

    def get_unhandled_progress(self):
        """Get unhandled progress
        """
        progress = self._prepository.get_all(query={"state": "new"},
                                             sort=(("createdAt", 1),))
        return progress

    def get_unhandled_progress_for_command(self, commandid):
        """Get unhandled progress for command
        """
        progress = self._prepository.get_all(query={"state": "new", "commandId": commandid},
                                             sort=(("createdAt", 1),))
        return progress

    @wtransaction
    def progress_handled(self, progress):
        """Mark progress as handled
        """
        progress.set_value("state", "handled")
        self._prepository.update(progress)

    def execute_command(self, command):
        """Execute command and save progress
        """
        assert command.get_value("state") != "interactive"
        self._logger.debug("Found command %s", command.commandid)

        # Execute the command in the task's user context
        task = self._tasks_repository.get(command.get_value("taskId"))
        try:
            with self._user_context.scope(task.get_value("userContext")):
                result = self._executor.execute(command)
        # pylint: disable=broad-except
        except Exception as exp:
            # pylint: enable=broad-except
            self._logger.error("Failed to execute command: %s", traceback.format_exc())
            result = CommandResult(False, True, str(exp), None)

        # Check to see if this command failed and we need to retry it later
        if isinstance(result, CommandResult) and result.failed:
            retry_limit = command.get_value("retryLimit", Command.RETRY_LIMIT_DEFAULT)
            retry_interval = command.get_value("retryInterval", Command.RETRY_INTERVAL_DEFAULT)
            retry_count = command.get_value("retryCount", Command.RETRY_COUNT_DEFAULT)

            if retry_count < retry_limit:
                self._logger.warning(
                    "Command %s failed with message: %s.\nWill retry. Retry count: %d.",
                    command.commandid,
                    result.description,
                    retry_count)

                command.set_value("retryCount", retry_count + 1)
                result = DelayCommandResult(retry_interval)

        self.report_progress(command, result)

    def execute_interactive_command(self, command):
        """Execute command, required user input on stdin
        """
        assert command.get_value("state") == "interactive"
        result = self._execute_interactive_command(command)
        self.report_progress(command, result)

    @wtransaction
    def post_interactive_answer(self, command, canceled, answer_payload):
        """Similar to how we execute interactive command in stdout/stdin
        in _execute_interactive_command, but this one we expect to be posted
        by user using REST.
        """
        if command.get_value("state") != "interactive":
            raise InvalidUserInputException(fmt="Cannot post answer for non interactive command")
        if canceled:
            result = CommandResult(failed=True, description="Canceled by user")
        else:
            choices = command.get_value(("payload", "choices"))
            user_choice = next((choice
                                for choice in choices
                                if choice["key"] == answer_payload.get("choice", None)), None)
            if user_choice is None:
                raise InvalidUserInputException(answer_payload["choice"], fmt="Unexpected user choice %s")
            if "input" in user_choice and "input" not in answer_payload:
                raise InvalidUserInputException(answer_payload["choice"],
                                                fmt="User input is expected for choice %s")
            if user_choice.get("input", "text") == "password":
                answer_payload["input"] = self._secure_storage.encrypt(answer_payload["input"])
            result = CommandResult(completed=True,
                                   description="User's answer: " + user_choice["description"],
                                   payload=answer_payload)
        return self.report_progress(command, result)

    def _execute_interactive_command(self, command):
        """Execute interactive command (internal)
        and return CommandResult
        """
        try:
            payload = command.get_value("payload")
            choices = payload["choices"]
            user_choice = self._execute_interactive_command_get_user_choice(payload["question_type"],
                                                                            payload["question"],
                                                                            choices,
                                                                            payload["data"])
            if user_choice is None:
                return CommandResult(failed=True, description="Canceled by user")
            answer_payload = {
                "choice": user_choice["key"]
            }
            if "input" in user_choice:
                answer_payload["input"] = self._execute_interactive_command_get_user_input(user_choice)
            sys.stdout.write(os.linesep)
            sys.stdout.flush()
            return CommandResult(completed=True,
                                 description="User's answer: " + user_choice["description"],
                                 payload=answer_payload)
        except KeyboardInterrupt:
            return CommandResult(failed=True, description="Canceled by user")

    def _execute_interactive_command_get_user_choice(self, question_type, question, choices, data):
        """
        Get user choice

        Print out choose menu like

        {question}
        Options:
        {choice_index + 1}) {choice}
        {len(choices) + 1}) Cancel
        Which option would you like (default: 1): |
        """
        assert self
        while True:
            sys.stdout.write(os.linesep)
            if isinstance(question, list):
                for qline in question:
                    sys.stdout.write(qline)
                    sys.stdout.write(os.linesep)
            else:
                sys.stdout.write(question)
            self._print_data_pretty(question_type, data)
            sys.stdout.write(os.linesep)
            sys.stdout.write("Options:")
            sys.stdout.write(os.linesep)
            for index, choice in enumerate(choices):
                sys.stdout.write("%d) %s " % (index + 1, choice["description"]))
                sys.stdout.write(os.linesep)
            sys.stdout.write("%d) Cancel" % (len(choices) + 1))
            sys.stdout.write(os.linesep)
            if sys.version_info >= (3, 0):
                user_answer_raw = input("Which option would you like (default: 1): ")
            else:
                user_answer_raw = raw_input("Which option would you like (default: 1): ")
            try:
                if user_answer_raw:
                    choice_int = int(user_answer_raw)
                else:
                    choice_int = 1

                if choice_int == len(choices) + 1:  # pylint: disable=no-else-return
                    return None
                elif 0 < choice_int <= len(choices):
                    return choices[choice_int - 1]
            except ValueError:
                pass

    def _execute_interactive_command_get_user_input(self, user_choice):
        """
        Get user input

        {choice} > |
        """
        user_input = None
        while not user_input:
            if user_choice["input"] == "password":
                user_input = getpass.getpass("%s > " % user_choice["description"])
                if user_input:
                    user_input = self._secure_storage.encrypt(user_input)
            else:
                if sys.version_info >= (3, 0):
                    user_input = input("%s > " % user_choice["description"])
                else:
                    user_input = raw_input("%s > " % user_choice["description"])
        return user_input

    def _print_data_pretty(self, question_type, data):
        """
        If question has some data and we know how to pretty print it - print it to the stdout
        """
        if question_type == "deployment_server_migration":
            self._print_data_pretty_for_deployment_server_migration(data)

    def _print_data_pretty_for_deployment_server_migration(self, data):
        """
        Print pretty data for the Deployment server migration
        """
        if data["groups"]:
            num_of_migrated = sum(1 for group in data["groups"].values() if group["canMigrate"])
            print("List of serverClasses (%s out of %s can be migrated):" % (num_of_migrated, len(data["groups"])))
            for server_class, group in data["groups"].items():
                self._print_object_pretty("serverClass", group, server_class)
        sys.stdout.write(os.linesep)
        if data["apps"]:
            num_of_migrated = sum(1 for app in data["apps"].values() if app["canMigrate"])
            print("List of applications (%s out of %s can be migrated):" % (num_of_migrated, len(data["apps"])))
            for app_name, app in data["apps"].items():
                self._print_object_pretty("app", app, app_name)
        sys.stdout.write(os.linesep)

    def _print_object_pretty(self, obj_type, obj, obj_name):
        """
        Print migrated object
        """
        print("%s %s" % ("-" if obj["canMigrate"] else "x", obj_name))
        print("  - migrated: %s" % ("yes" if obj["canMigrate"] else "no"))
        for message in obj["messages"]:
            print("      %s" % message)
        if obj["canMigrate"]:
            print("  - %s:" % obj_type)
            for key, value in obj["migrated"].items():
                pretty_value = value
                if isinstance(pretty_value, list):
                    pretty_value = ", ".join(pretty_value)
                print("      %s: %s" % (key, pretty_value))
