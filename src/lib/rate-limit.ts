import { Options, rateLimit as createLimit } from "express-rate-limit";

const defaultOptions: Partial<Options> = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
	message: {
		status: 429,
		isError: true,
		isSuccess: false,
		message: "Too many requests, please try again later.",
		data: {}
	}
};
const rateLimit = (options: Partial<Options> = {}) => {
	return createLimit({ ...defaultOptions, ...options });
};

export default rateLimit;
