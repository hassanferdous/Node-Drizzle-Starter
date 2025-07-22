import { emailQueue } from "@/lib/queue";

export const sendOtpEmailJob = async (payload: {
	to: string;
	subject: string;
	html: string;
}) => {
	const res = await emailQueue.add("send-otp-email", payload, {
		attempts: 3, // retry up to 3 times on failure
		removeOnComplete: true,
		removeOnFail: false
	});

	return res;
};
