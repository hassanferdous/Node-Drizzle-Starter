// src/lib/redis.ts
import Redis from "ioredis";

import { config } from "@/config";

const redisClient = new Redis({
	host: config.redis.host || "localhost",
	port: Number(config.redis.port) || 6379,
	// password: process.env.REDIS_PASSWORD, // Optional
	// username: process.env.REDIS_USER, // Optional for Redis Enterprise
	maxRetriesPerRequest: null,
	enableReadyCheck: true,
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	}
});
export const bullRedisClient = new Redis({
	host: config.redis.host || "localhost",
	port: Number(config.redis.port) || 6379,
	maxRetriesPerRequest: null,
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	}
});

redisClient.on("connect", () => {
	console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
	console.error("❌ Redis connection error:", err);
});

export default redisClient;
