import { db } from "@/config/db";
import { userTokensTable } from "@/db/schema";
import logger from "@/lib/logger";
import { lt } from "drizzle-orm";
import { CronJob } from "cron";

export default class JobDBSession {
	static cleanDB() {
		return CronJob.from({
			cronTime: "0 0 0 * * *",
			onTick: async function () {
				try {
					await db
						.delete(userTokensTable)
						.where(lt(userTokensTable.expires_at, new Date()));
					logger.info("✅ Cleaned up expired sessions from DB!");
				} catch (error) {
					logger.error(
						"❌ Something went wrong while cleaning up expired sessions",
						error
					);
				}
			},
			start: false,
			timeZone: "Asia/Dhaka"
		});
	}
}
