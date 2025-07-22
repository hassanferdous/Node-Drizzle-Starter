import crypto from "crypto";
import redisClient from "./redis";

export const generateOTP = (length = 6) => {
	const max = Math.pow(10, length);
	const otp = crypto.randomInt(0, max);
	return otp.toString().padStart(length, "0");
};

const OTP_EXPIRY = 2 * 60; // 2 minutes in seconds

export const saveOTP = async (key: string, otp: string) => {
	await redisClient.setex(`otp:${key}`, OTP_EXPIRY, otp);
};

export const verifyOTP = async (key: string, inputOtp: string) => {
	const storedOtp = await redisClient.get(`otp:${key}`);
	if (!storedOtp) return false;
	if (storedOtp !== inputOtp) return false;

	await redisClient.del(`otp:${key}`); // delete after successful verification
	return true;
};
