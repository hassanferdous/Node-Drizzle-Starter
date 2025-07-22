import { Queue } from "bullmq";
import { bullRedisClient } from "./redis";

export const emailQueue = new Queue("email-queue", {
	connection: bullRedisClient
});
