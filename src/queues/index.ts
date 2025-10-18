import mqConnection from "@/mq/MqConnection";
import { emailWorker } from "./email";

async function initWorkders() {
	await mqConnection.connect();
	await emailWorker.start();
}

export default initWorkders;
