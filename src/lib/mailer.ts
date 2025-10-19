import nodemailer from "nodemailer";
import { config } from "@/config";
import logger from "./logger";

const transporter = nodemailer.createTransport({
	host: config.smtp.SMTP_HOST,
	port: parseInt(config.smtp.SMTP_PORT),
	secure: config.app.env === "production",
	auth: {
		user: config.smtp.SMTP_USER,
		pass: config.smtp.SMTP_PASS
	}
});

export const sendEmail = async ({
	to,
	subject,
	html,
	text = "",
	from = `${config.smtp.SMTP_FROM || config.smtp.SMTP_USER}`
}: {
	to: string;
	subject: string;
	html?: string;
	text?: string;
	from?: string;
}) => {
	const info = await transporter.sendMail({
		from,
		to,
		subject,
		html,
		text
	});

	logger.info("📤 Email sent:", info.messageId);
	if (config.app.env === "development") {
		logger.info("📝 Preview URL:", nodemailer.getTestMessageUrl(info));
	}
	return info;
};
