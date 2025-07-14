import redis from "@/lib/redis";

async function getCachedOrLoad<T>(
	key: string,
	loader: () => Promise<T>,
	ttl = 3600
): Promise<T> {
	const cached = await redis.get(key);
	if (cached) {
		console.log("******* from cached **********");
		return JSON.parse(cached);
	}
	const data = await loader();
	console.log("******* re-cached **********");
	await redis.set(key, JSON.stringify(data), "EX", ttl);
	return data;
}

export default getCachedOrLoad;
