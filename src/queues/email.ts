import logger from "@/lib/logger";
import { sendEmail } from "@/lib/mailer";
import BaseMQ, { MQConfigType } from "@/mq/BaseMQ";

class EmailWorker extends BaseMQ<any> {
	constructor(config: MQConfigType) {
		super(config);
	}

	// Consumer
	protected async consumer() {
		this.channel.consume(this.config.name, async (msg) => {
			if (!msg) return;
			try {
				if (Math.random() > 0.5) {
					throw new Error("Email sending failed.");
				}
				const data = JSON.parse(msg.content.toString());
				const { to, subject, html } = data;
				await sendEmail({ to, subject, html });
				this.channel.ack(msg);
			} catch (error: any) {
				logger.error(error.message);
				this.handleRetry(msg);
			}
		});
	}

	async send(data: any) {
		this.channel.sendToQueue(
			this.config.name,
			Buffer.from(JSON.stringify(data)),
			{
				persistent: true
			}
		);
	}
}

export const emailWorker = new EmailWorker({
	name: "email.queue",
	exchange: "email.exchange",
	routingKey: "email.routingKey",
	retry: true,
	enableDLQ: true
});
