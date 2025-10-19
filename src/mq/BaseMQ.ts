import logger from "@/lib/logger";
import { Channel, Options } from "amqplib";
import mqConnection from "./MqConnection";

type OnInit = (instance: BaseMQ<any>) => void;

export type MQConfigType = {
	name: string;
	exchange?: string;
	routingKey?: string;
	isDurable?: boolean;
	exchangeType?: string;
	onInit?: OnInit;
	enableDLQ?: boolean;
	maxRetries?: number;
	retry?: boolean;
	onDeadLetter?: (instance: BaseMQ<any>) => Promise<void>;
};

export default abstract class BaseMQ<T> {
	protected config!: MQConfigType;
	protected channel!: Channel;
	#dlx!: string;
	#dlq!: string;
	#dlRoutingKey!: string;
	#retry!: string;
	#retryRoutingKey!: string;

	constructor(config: MQConfigType) {
		this.config = config;
		if (this.config.enableDLQ) {
			this.#dlq = `${this.config.name}.dlq`;
			this.#dlx = `${this.config.name}.dlx`;
			this.#dlRoutingKey = `${this.config.name}.failed`;
			this.#retry = `${this.config.name}.retry`;
			this.#retryRoutingKey = `${this.config.name}.retry_route`;
		}
	}

	async #init() {
		this.channel = mqConnection.channel;

		await this.#setupDLQ();
		await this.#setupMainMainQueue();

		// OnInit callback
		this.config.onInit?.(this);
	}

	// Setup main queue
	async #setupMainMainQueue() {
		let options: Options.AssertQueue = {
			durable: this.config.isDurable || true,
			arguments: {}
		};

		if (this.config.enableDLQ) {
			options = {
				...options,
				arguments: {
					"x-dead-letter-exchange": this.#dlx,
					"x-dead-letter-routing-key": this.config.retry
						? this.#retryRoutingKey
						: this.#dlRoutingKey
				}
			};
		}
		await this.channel.assertQueue(this.config.name, options);
	}

	// Setup DLQ and Retry
	async #setupDLQ() {
		await this.channel.assertExchange(this.#dlx, "direct", { durable: true });
		await this.channel.assertQueue(this.#dlq, { durable: true });
		await this.channel.bindQueue(this.#dlq, this.#dlx, this.#dlRoutingKey);

		// if retry is enabled setup retry queue
		if (this.config.retry) {
			await this.channel.assertQueue(this.#retry, {
				durable: true,
				arguments: {
					"x-dead-letter-exchange": "",
					"x-dead-letter-routing-key": this.config.name,
					"x-message-ttl": 5000
				}
			});
			await this.channel.bindQueue(
				this.#retry,
				this.#dlx,
				this.#retryRoutingKey
			);
		}
	}

	// Handle retry
	protected handleRetry(message: any) {
		if (!message || !this.config.retry)
			return this.channel.nack(message, false, false);
		let headers = message.properties.headers;
		let retryCount = headers["x-retry-count"] || 0;

		retryCount++;
		if (retryCount > (this.config.maxRetries || 3)) {
			logger.info("Moving message to DLQ for:", this.config.name);
			// Send manually to DLQ instead of nack
			this.channel.sendToQueue(this.#dlq, message.content, {
				headers: { ...headers, "x-retry-count": retryCount },
				persistent: true
			});

			this.channel.ack(message);
		} else {
			logger.info(`Retry ${retryCount} for ${this.config.name}`);
			this.channel.sendToQueue(
				`${this.config.name}.retry`,
				message.content,
				{
					headers: { ...headers, "x-retry-count": retryCount },
					persistent: true
				}
			);
			this.channel.ack(message);
		}
	}

	//
	async #consumerDLQ() {
		if (!this.config.enableDLQ) return;
		this.channel.consume(this.#dlq, async (msg) => {
			if (!msg) return null;
			// Check if this is a retry
			const headers = msg.properties.headers || {};
			let retryCount = headers["x-retry-count"] || 0;
			logger.info("DLQ message received, retry count:", retryCount);
			this.config.onDeadLetter?.(this);
			this.channel.ack(msg);
		});
	}

	abstract send(data: T): Promise<void>;
	protected abstract consumer(): Promise<void>;

	async start() {
		/**** Call init func *****/
		await this.#init();
		/**** Start consumer *****/
		await this.consumer();

		if (this.config.enableDLQ) {
			this.#consumerDLQ();
		}
	}
}
