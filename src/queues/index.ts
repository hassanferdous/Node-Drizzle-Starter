import mqConnection from "@/mq/MqConnection";
import { emailWorker } from "./email";
import logger from "@/lib/logger";

async function initWorkders() {
	await mqConnection.connect();
	await emailWorker.start();
	logger.info("✅ All queues are running");
}

export default initWorkders;
