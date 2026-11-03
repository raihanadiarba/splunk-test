// requirements
var child_process = require('child_process');
var path = require('path');
var fs = require('fs');
var program = require('commander');

var collectFilesSync = require('./splcore_src/build_tools/util/collectFilesSync');

program
    .description('A utility for building splunk apps')
    .option('-j --jobs <n>', 'number of parallel processes (eg. -j8)', parseAbs)
    .option('-v, --verbose', 'enable debug output, -vv log output of tasks', increaseVerbosity, 0)
    .option('--stats', 'show aggregated build time for task groups')
    .option('-o, --run-once', 'only run the build tasks if the build output directory does not exist')
    .arguments('[filter]', 'Only run tasks with the given prefix (eg. "css:legacy" to build all legacy css files, or "css" to build all css files)')
    .option('-l --output-lines <n>', 'number of lines to output from the first process that fails', parseAbs)
    .option('-u --update-generated-list', 'Update generated list for the packaging process')
    .option('-s --source-dir <dir>', 'directory of $SPLUNK_SOURCE')
    .option('-b --build-dir <dir>', 'directory of splunk build directory')
    .option('-H --splunk-home <dir>', 'value to use as $SPLUNK_HOME')
    .option('-I --splunk-install <dir>', 'directory to install to. Defaults to $SPLUNK_HOME')
    .option('-a --app-dir <dir>', 'directory of app', resolvePath)
    .option('-t --tasks', 'list tasks')
    .option('-w, --watch', 'use watch mode; note: it is recommended to have at least as many processes as tasks')
    .option('-d, --dev', 'use dev mode')
    .option('-r, --live-reload', 'use live reload')
    .option('-T --dont-bail-on-error', 'Tolerate build errors and continue, rather than exiting')
    .option('--splunkVersion <n>', 'supply version number')
    .allowUnknownOption(false)
    .parse(process.argv);

var hasError = false;
var args = program.opts();
args['filter'] = program.args[0];

args.appName = 'dmc';

function increaseVerbosity(val, total) {
    return total + 1;
}

function resolvePath(val) {
    return path.resolve(val);
}

function parseAbs(val) {
    return Math.abs(parseInt(val, 10));
}

var logger = {
    log: console.log.bind(console),
    debug: args.verbose ? console.log.bind(console) : function() {},
    time: args.verbose ? console.time.bind(console) : function() {},
    timeEnd: args.verbose ? console.timeEnd.bind(console) : function() {}
};

logger.time('Full Build');
logger.debug("Web Building 2.0");

if (args.jobs == null) {
    if (args.runOnce) {
        // For --run-once (typically invoked via make install) we use a specified environment
        // variable or determine a reasonable number of concurrently running tasks based on the
        // number of CPUs available
        var cores = process.env.BUILDJS_CPUS ?
            parseInt(process.env.BUILDJS_CPUS.replace(/-j/, ''), 10) :
            (require('os').cpus() || []).length;
        args.jobs = Math.max(1, Math.floor(cores / 4) - 1);
        logger.debug('CPU cores:', cores, '--> -j' + args.jobs);

        if (isNaN(args.jobs)) {
            throw new Error('Invalid number of jobs');
        }
    } else {
        // Default
        args.jobs = 4;
    }
}

logger.debug("args", args);

var COLORS = {
    apply: function(str, code) {
        return process.stdout.isTTY ? '\033[' + code + 'm' + str + '\033[39m' : str;
    },
    red: function(str) {
        return COLORS.apply(str, 31);
    },
    green: function(str) {
        return COLORS.apply(str, 32);
    },
    yellow: function(str) {
        return COLORS.apply(str, 33);
    },
    none: function(str) {
        return str;
    }
};
var NUM_PROCESSES = args.jobs;
var CHECK = COLORS.green('✔');
var FAIL = COLORS.red('✗');

// Check environment variables
if (args.sourceDir == null) {
    if (!process.env.SPLUNK_SOURCE && process.env.SPLUNK_SRC) {
        process.env.SPLUNK_SOURCE = process.env.SPLUNK_SRC;
    }
} else {
    process.env.SPLUNK_SOURCE = args.sourceDir;
}

if (args.splunkHome != null) {
    process.env.SPLUNK_HOME = args.splunkHome;
}

if (args.splunkInstall == null) {
    // default to splunk home
    process.env.SPLUNK_INSTALL = process.env.SPLUNK_HOME
} else {
    process.env.SPLUNK_INSTALL = args.splunkInstall
}

if (args.buildDir == null) {
    // default to the standard out-of-tree build directory under the repo root
    process.env.SPLUNK_BUILD_DIR = path.join(process.env.SPLUNK_SOURCE, 'build');
} else {
    process.env.SPLUNK_BUILD_DIR = args.buildDir;
}

var constants = require('./splcore_src/build_tools/constants');
var GENERATED_LIST_FILE = path.join(process.env.SPLUNK_BUILD_DIR, 'generated.list');
var RUN_ONCE_BUILD_DIR = path.join(constants.appBuildDir, args.appName, 'appserver', 'static', 'build');

try {
    if (args.runOnce && fs.lstatSync(RUN_ONCE_BUILD_DIR).isDirectory()) {
        logger.debug("Minification already run once");
        process.exit(0);
    }
} catch (e) {
    //we need to run since build dir doesn't exist
}

// Utility functions

function toInt(arg, msg) {
    var res = parseInt(arg, 10);
    if (isNaN(res)) {
        throw new Error(msg + ' ' + JSON.stringify(arg));
    }
    return res;
}

function concatAll() {
    var result = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        result = result.concat(arguments[i]);
    }
    return result;
}


var tasks = require('./splcore_src/build_tools/tasks');

var profileDirPath = path.join(__dirname, "profiles");
var buildJsProfilesTasks = tasks.generateJsProfilesTasks(profileDirPath, args.appName, args);
var buildTasks = buildJsProfilesTasks;

var completed = {};
var running = 0;
var stats = {};
var total;

function matchesTaskName(pattern, taskName) {
    var taskParts = taskName.split(':');
    return pattern.split(':').every(function(part, idx) {
        return part == taskParts[idx];
    });
}

function expandDependencies(buildTasks) {
    buildTasks.forEach(function(task) {
        if (task.deps) {
            var deps = [], orig = task.deps;
            task.deps.forEach(function(depPattern) {
                buildTasks.forEach(function(t) {
                    if (matchesTaskName(depPattern, t.name)) {
                        t.weight = Math.max(t.weight || 1, task.weight + 1);
                        deps.push(t.name);
                    }
                });
            });
            task.deps = deps;
            logger.debug('Expanded deps', JSON.stringify(orig), '->', JSON.stringify(deps));
        }
    });
}

function checkDependenciesMet(cmd) {
    if (cmd.deps) {
        logger.debug('Checking if dependencies met for', cmd.name);
        return cmd.deps.every(function(dep) {
            return completed[dep];
        });
    }
    return true;
}

function nextTask() {
    var i = buildTasks.length;
    while (i--) {
        if (checkDependenciesMet(buildTasks[i])) {
            return buildTasks.splice(i, 1)[0];
        }
    }
}

function progress(completedTasks) {
    var msg = '[' + completedTasks + '/' + total + ']';
    while (msg.length < 10) msg += ' ';
    return msg;
}

function prepareArgs(cmd) {
    var cmdArgs = cmd.args || [];
    if ((args.verbose >= 2) && cmd.verbose_args) {
        cmdArgs = cmdArgs.concat(cmd.verbose_args);
    }
    return cmdArgs.map(function(arg) {
        return arg.replace(constants.$dst, cmd.dst).replace(constants.$src, cmd.src);
    });
}

function startNext() {
    //grab the next available command
    var cmd = nextTask();

    // If there is nothing to schedule - bail
    if (!cmd) {
        logger.debug("no more tasks");
        return;
    }

    // Spawn off the next process
    logger.time(cmd.name);
    var startTime = Date.now();

    if (cmd.dst) {
        logger.debug('Creating partent directory for task destination path', path.dirname(cmd.dst));
        mkdirp(path.dirname(cmd.dst));
    }

    logger.debug("prepare args for cmd", cmd);
    var cmdArgs = prepareArgs(cmd);
    logger.debug("SPAWN new process: " + cmd.cmd + " with args=" + cmdArgs.join(' '));
    var opts = cmd.opts || {};
    var cp = child_process.spawn(cmd.cmd, cmdArgs, opts);

    var outputBuf = [];
    var outputBufLimit = args.outputLines;
    cp.stdout.on('data', function(data) {
        data = data.toString().split('\n');
        if (args.verbose >= 2) {
            data.forEach(function(line) {
                logger.log('STDOUT [' + cmd.name + '] ', COLORS.yellow(line));
            });
        }
        outputBuf = outputBuf.concat(data);
        while (outputBuf.length > outputBufLimit) outputBuf.shift();
    });

    cp.stderr.on('data', function(data) {
        data = data.toString().split('\n');
        if (args.verbose >= 2) {
            data.forEach(function(line) {
                logger.log('STDERR [' + cmd.name + '] ', COLORS.yellow(line));
            });
        }
        outputBuf = outputBuf.concat(data);
        while (outputBuf.length > outputBufLimit) outputBuf.shift();
    });

    cp.on('close', function(code) {
        logger.timeEnd(cmd.name);
        if (code !== 0) {
            logger.log('Task', cmd.name, 'failed', FAIL);
            logger.log();
            if (outputBuf.length) {
                logger.log('Last', outputBuf.length, 'lines from command output:');
                outputBuf.forEach(function(line) {
                    logger.log(COLORS.red(line));
                });
                logger.log();
            }
            hasError = true;
            if (!args.dontBailOnError) {
                process.exit(code);
            }
            return;
        } else {
            completed[cmd.name] = true;
            logger.log(progress(Object.keys(completed).length), cmd.name, CHECK);
        }
        stats[cmd.name] = Date.now() - startTime;
        running--;
        startNext();
    });

    running++;
    if (running < NUM_PROCESSES) {
        startNext();
    }
}

expandDependencies(buildTasks);
if (args.filter) {
    logger.debug('Applying filter', JSON.stringify(args.filter));
    var filtered = buildTasks.filter(function(cmd) {
        return matchesTaskName(args.filter, cmd.name);
    });

    function addDeps(cmd) {
        if (cmd.deps) {
            cmd.deps.forEach(function(depName) {
                var dep = buildTasks.filter(function(cmd2) { return cmd2.name == depName; })[0];
                filtered.push(dep);
                addDeps(dep);
            });
        }
    }

    filtered.forEach(addDeps);
    if (!filtered.length) {
        logger.log('No tasks found matching the filter!');
        process.exit(1);
    }
    buildTasks = filtered;
}

if (buildTasks.length > args.jobs && args.watch) {
    console.log('');
    console.log('**********! BUILD FAILED !**********');
    console.log('Not enough processes for watch tasks');
    console.log('Set -j to at least number of tasks');
    process.exit(1);
}

// Sort task by weight
buildTasks.sort(function(a, b) {
    return (a.weight || 1) - (b.weight || 1);
});

if (args.tasks) {
    buildTasks.forEach(function(task) {
        logger.log(task.name);
        logger.debug(task)
    });
    process.exit();
}

logger.debug('Running', buildTasks.length, 'tasks,', NUM_PROCESSES, 'in parallel', args.filter ? 'with filter ' + JSON.stringify(args.filter) : '...');
total = buildTasks.length;
logger.debug('Tasks to execute:');
logger.debug(JSON.stringify(buildTasks, null, 2));
startNext();

function collectGeneratedFiles(dir, prefix) {
    var result = [{
        type: 'd',
        name: prefix
    }];
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function(sub) {
            var full = path.join(dir, sub);
            var name = prefix ? path.join(prefix, sub) : sub;
            if (fs.lstatSync(full).isDirectory()) {
                result = result.concat(collectGeneratedFiles(full, name));
            } else {
                result.push({
                    type: 'f',
                    name: name
                });
            }
        });
    }
    return result;
}

var collectAnachronisticFiles = function() {
    return collectFilesSync(constants.jsDir,  /\.(pcss|pcssm|jsx)\.js/, true)
        .map(function(fileName) {
            return {
                type: 'f',
                name: fileName.replace(constants.webBuildDir + path.sep, '')
            };
        });
}

function updateGeneratedList(buildFilesInfo, filesInApp) {
    var pathPrefix;
    if (filesInApp == true) {
        pathPrefix = path.join(constants.appDestRelDir, args.appName);
    } else {
        pathPrefix = path.join('share', 'splunk');
    }
    logger.log('Updating generated.list');
    var count = 0;
    var generatedListContent = buildFilesInfo.map(function(entry) {
        count++;
        var name = path.join(pathPrefix, entry.name);
        if (path.sep !== path.posix.sep) {
            name = path.posix.join.apply(null, name.split(path.sep));
        }
        return entry.type == 'd' ?
            ['d', '755', 'splunk', 'splunk', path.posix.join('splunk', name), '-'].join(' ') :
            ['f', '444', 'splunk', 'splunk', path.posix.join('splunk', name), name].join(' ');
    }).join('\n');
    logger.debug('Generated generated.list content:\n', generatedListContent);
    logger.log('Adding', count, 'entries to generated.list');
    fs.appendFileSync(GENERATED_LIST_FILE, generatedListContent + '\n', {encoding: 'utf8'});
}

function installBuiltFiles(buildFilesInfo) {
    var destPrefix = path.join(constants.appDestDir, args.appName);
    var srcPrefix = path.join(constants.appBuildDir, args.appName);

    logger.debug('Installing built files', srcPrefix, '->', destPrefix);
    buildFilesInfo.forEach(function(info) {
        if (info.type == 'd') {
            mkdirp(path.join(destPrefix, info.name));
        } else {
            logger.debug('Copying file', info.name, 'from build to', destPrefix, 'from', srcPrefix);
            copyFile(path.join(srcPrefix, info.name), path.join(destPrefix, info.name));
        }
    });
}

function mkdirp(dirname) {
    try {
        fs.mkdirSync(dirname);
    } catch (err) {
        if (err.code == "ENOENT") {
            var slashIdx = dirname.lastIndexOf(path.sep);

            if (slashIdx > 0) {
                var parentPath = dirname.substring(0, slashIdx);
                mkdirp(parentPath);
                mkdirp(dirname);
            } else {
                throw err;
            }
        } else if (err.code != "EEXIST") {
            throw err;
        }
    }
}

function copyFile(src, dest) {
    fs.writeFileSync(dest, fs.readFileSync(src));
}

function copyFolderSync(src, dest) {
    try {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        fs.readdirSync(src).forEach(element => {
            if (fs.lstatSync(path.join(src, element)).isFile()) {
                fs.copyFileSync(path.join(src, element), path.join(dest, element));
            } else {
                copyFolderSync(path.join(src, element), path.join(dest, element));
            }
        });

    } catch (err) {
        logger.log('Unable to copy folder. Error: ', err);
    }
}

process.on('exit', function(code) {
    var success = code === 0 && !hasError;
    var buildName = args.appName ? 'App: ' + args.appName : 'Core';
    if (success) {
        var buildFilesInfo = [];

        var fromDir = path.join(constants.appBuildDir, args.appName, 'appserver', 'static');
        var relFromDir = path.join('appserver', 'static');
        buildFilesInfo = collectGeneratedFiles(fromDir, relFromDir);
        installBuiltFiles(buildFilesInfo);
        if (args.updateGeneratedList) {
            updateGeneratedList(buildFilesInfo, true);
        }

        // Make the enterprise remote apps directory in case it does not exist yet
        var libRemoteApps = path.join(process.env.SPLUNK_INSTALL, 'lib/remoteApps')
        var entRemoteAppsDir = path.join(
            process.env.SPLUNK_INSTALL,
            'share/splunk/search_mrsparkle/exposed/build/pages/enterprise/remoteApps'
        );
        mkdirp(entRemoteAppsDir);
        // Copy Remote Apps from lib to enterpise page dir
        copyFolderSync(libRemoteApps, entRemoteAppsDir);

        remoteAppsBuildFilesInfo = collectGeneratedFiles(entRemoteAppsDir, 'search_mrsparkle/exposed/build/pages/enterprise/remoteApps');
        if (args.updateGeneratedList) {
            updateGeneratedList(remoteAppsBuildFilesInfo, false);
        }

        var installCount = buildFilesInfo.filter(function(info) {
            return info.type == 'f';
        }).length;
        if (installCount > 0) {
            logger.log(' ___________________\n< ' +
                COLORS['none'](buildName + ' build is done') + ' >\n' +
                ' -------------------\n' +
                '   \\    _^,\n' +
                '    \\  (0_\\",______\n' +
                '       /_/ \\"      )%\n' +
                '           ||------| %\n' +
                '           | \\   / |  %\n');
        }
    } else {
        logger.log(' ___________________\n< ' +
            COLORS['red'](buildName + ' build FAILED!') + ' >\n' +
            ' -------------------\n' +
            '  \\        ,__  __\n' +
            '    _^,    ;  \\:  )%\n' +
            '   (X_\":   |------| %\n' +
            '   /_/ ;   / \\   / \\ %\n' +
            '   ;\n');
    }

    if (args.stats || args.verbose) {
        // Output total time used per task group
        var groupStats = {};
        logger.log();
        Object.keys(stats).forEach(function(name) {
            var k = name.split(':').slice(0, 2).join(':');
            groupStats[k] = (groupStats[k] || 0) + stats[name];
        });
        var pad = function(n) {
            return n < 10 ? '0' + n : String(n);
        };
        Object.keys(groupStats).forEach(function(group) {
            var total = groupStats[group];
            logger.log('Total build time for', group, pad(Math.floor(total / 60000)) + ':' + pad(Math.round(total % 60000 / 1000)));
        });
    }

    logger.timeEnd('Full Build');
    logger.debug('About to exit with code=' + code);
});
