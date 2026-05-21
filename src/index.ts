import { MASTODON_API_URL } from "./config/env";
import { logger } from "./utils/logger";
import { startBot } from "./bot/scheduler";

logger.info("Mastodon IT Bot starting.");
logger.info(`Connected to instance: ${MASTODON_API_URL}`);

startBot();
