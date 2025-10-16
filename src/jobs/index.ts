import logger from "@/lib/logger";
import JobDBSession from "./db-session.job";

export default function registerJobs() {
	JobDBSession.cleanDB().start();
	logger.info("✅ All Jobs are running");
}
