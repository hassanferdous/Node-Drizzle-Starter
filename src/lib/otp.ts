import crypto from "crypto";
import redisClient from "./redis";

export const generateOTP = (length = 6) => {
	const max = Math.pow(10, length);
	const otp = crypto.randomInt(0, max);
	return otp.toString().padStart(length, "0");
};

const OTP_EXPIRY = 3 * 60; // 3 minutes in seconds

export const saveOTP = async (userId: number, otp: string) => {
	await redisClient.setex(`otp:user:${userId}`, OTP_EXPIRY, otp);
};

export const verifyOTP = async (userId: number, inputOtp: string) => {
	const storedOtp = await redisClient.get(`otp:user:${userId}`);
	if (!storedOtp) return false;
	if (storedOtp !== inputOtp) return false;

	await redisClient.del(`otp:user:${userId}`); // delete after successful verification
	return true;
};
