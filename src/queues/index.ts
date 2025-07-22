import { startEmailWorker } from "./email.worker";

function initWorkders() {
	console.log("🚀 Initializing all workers...");
	startEmailWorker();
	console.log("✅ All workers initialized");
}

export default initWorkders;
