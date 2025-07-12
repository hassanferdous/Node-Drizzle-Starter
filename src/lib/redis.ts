// src/lib/redis.ts
import Redis from "ioredis";

import { config } from "@/config";

const redis = new Redis({
	host: config.redis.host || "localhost",
	port: Number(config.redis.port) || 6379,
	// password: process.env.REDIS_PASSWORD, // Optional
	// username: process.env.REDIS_USER, // Optional for Redis Enterprise
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	}
});

redis.on("connect", () => {
	console.log("✅ Redis connected");
});

redis.on("error", (err) => {
	console.error("❌ Redis connection error:", err);
});

export default redis;
