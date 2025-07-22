import { sendEmail } from "@/lib/mailer";
import { bullRedisClient } from "@/lib/redis";
import { Job, Worker } from "bullmq";

export const startEmailWorker = () => {
	const emailWorker = new Worker(
		"email-queue",
		async (job: Job) => {
			const { to, subject, html } = job.data;
			await sendEmail({ to, subject, html });
		},
		{
			connection: bullRedisClient
		}
	);

	emailWorker.on("completed", (job) => {
		console.log(`✅ Job ${job.id} completed`);
	});

	emailWorker.on("failed", (job, err) => {
		console.error(`❌ Job ${job?.id} failed:`, err.message);
	});
};
