import logger from "@/lib/logger";
import amqp, { Channel, ChannelModel } from "amqplib";
class RabbitMqConnection {
	private connected!: Boolean;
	connection!: ChannelModel;
	channel!: Channel;

	private readonly RABBITMQ_URL = process.env.RABBITMQ_URL!;
	private readonly MAX_RETRIES = 10;
	private readonly RETRY_DELAY = 3000; // ms

	async connect(): Promise<void> {
		if (this.connected && this.channel) {
			logger.info("🐇 RabbitMQ already connected, skipping reconnection");
			return;
		}

		for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
			try {
				logger.info(
					`🐇 Attempting RabbitMQ connection (${attempt}/${this.MAX_RETRIES})...`
				);
				this.connection = await amqp.connect(this.RABBITMQ_URL);
				this.channel = await this.connection.createChannel();
				this.connected = true;

				logger.info("✅ RabbitMQ connected successfully");

				this.setupEventHandlers();
				break; // stop retrying on success
			} catch (error: any) {
				logger.error(
					`❌ RabbitMQ connection failed (attempt ${attempt}): ${error.message}`
				);

				if (attempt === this.MAX_RETRIES) {
					logger.error(
						"🚨 Max retries reached. RabbitMQ connection failed permanently."
					);
					throw error;
				}

				await this.delay(this.RETRY_DELAY);
			}
		}
	}

	private setupEventHandlers() {
		this.connection.on("close", () => {
			logger.warn(
				"⚠️ RabbitMQ connection closed. Attempting to reconnect..."
			);
		});

		this.connection.on("error", (err) => {
			logger.error("💥 RabbitMQ connection error:", err);
		});

		this.channel.on("error", (err) => {
			logger.error("💥 RabbitMQ channel error:", err);
		});
	}

	private delay(ms: number): Promise<void> {
		return new Promise((res) => setTimeout(res, ms));
	}

	getChannel(): Channel {
		if (!this.channel) {
			throw new Error(
				"❌ RabbitMQ channel not initialized. Call connect() first."
			);
		}
		return this.channel;
	}
}

const mqConnection = new RabbitMqConnection();

export default mqConnection;
