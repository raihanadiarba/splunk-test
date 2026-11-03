import asyncio
from cloudgateway.private.websocket.parent_process_monitor import AbstractParentProcessMonitor
from cloudgateway.private.util.constants import WS_NO_RETRY


class AioParentProcessMonitor(AbstractParentProcessMonitor):
    """ Aiohttp based Parent Process Monitor """

    async def async_monitor(self, logger, websocket_ctx, protocol):
        logger.debug("Running parent process monitor")
        if self.parent_pid:
            while not protocol.closed:
                is_parent_running = self.is_parent_process_running()
                logger.debug("Parent process is running=%s" % str(is_parent_running))

                if not is_parent_running:
                    logger.info("parent_pid=%s is not running. Stopping websocket" % self.parent_pid)

                    # Websocket graceful shutdown
                    if websocket_ctx and protocol:
                        websocket_ctx.RETRY_INTERVAL_SECONDS = WS_NO_RETRY
                        await protocol.close()
                        return

                await asyncio.sleep(self.MONITOR_FREQENCY_SECONDS)
        else:
            logger.debug("System OS is windows. Parent process monitor is not running. ")
