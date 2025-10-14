import winston from "winston";
import path from "path";
import fs from "fs";
import "winston-daily-rotate-file";
import { config } from "@/config";

// Ensure log directory exists
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, errors, json } = winston.format;

// Define log format for development
const devFormat = combine(
	timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	printf(({ timestamp, level, message, stack }) => {
		return `${timestamp} [${level}]: ${stack || message}`;
	})
);

// Define log format for production
const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const logTransport = new winston.transports.DailyRotateFile({
	filename: path.join(logDir, "app-%DATE%.log"),
	datePattern: "YYYY-MM-DD",
	handleExceptions: true,
	maxSize: "20m",
	maxFiles: "14d"
});

const errorTransport = new winston.transports.DailyRotateFile({
	level: "error",
	filename: path.join(logDir, "application-error-%DATE%.log"),
	datePattern: "YYYY-MM-DD-HH",
	zippedArchive: true,
	maxSize: "20m",
	maxFiles: "14d"
});

// Create Winston logger instance
const logger = winston.createLogger({
	level: config.app.logLevel,
	format: config.app.env === "production" ? prodFormat : devFormat,
	transports: [logTransport, errorTransport],
	exitOnError: false
});

if (config.app.env !== "production") {
	logger.add(
		new winston.transports.Console({
			handleExceptions: true,
			format: winston.format.simple()
		})
	);
}

export default logger;
