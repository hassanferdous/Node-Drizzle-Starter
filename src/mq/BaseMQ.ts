import { Channel, Replies } from "amqplib";
import mqConnection from "./MqConnection";

type OnInit = (
	channel: Channel,
	defaultQueue: Promise<Replies.AssertQueue>,
	config: {
		name: string;
		exchange?: string;
		routingKey?: string;
		exchangeType?: string;
	}
) => void;

export type MQConfigType = {
	name: string;
	exchange?: string;
	routingKey?: string;
	isDurable?: boolean;
	exchangeType?: string;
	onInit?: OnInit;
};

export default abstract class BaseMQ<T> {
	private name!: string;
	private exchange?: string;
	private routingKey?: string;
	private isDurable?: boolean;
	private exchangeType?: string;
	private defaultQueue!: Promise<Replies.AssertQueue>;
	private channel!: Channel;
	private onInit?: OnInit;

	constructor(config: MQConfigType) {
		this.name = config.name;
		this.exchange = config.exchange;
		this.routingKey = config.routingKey;
		this.isDurable = config.isDurable || false;
		this.exchangeType = config.exchangeType || "direct";
		this.onInit = config.onInit;
	}

	private async init() {
		this.channel = mqConnection.channel;
		this.defaultQueue = this.channel.assertQueue(this.name, {
			durable: this.isDurable
		});
		if (this.exchange && this.exchangeType) {
			this.channel.assertExchange(this.exchange, this.exchangeType, {
				durable: this.isDurable
			});
			if (!this.routingKey) throw new Error("Routing key is missing");
			else this.channel.bindQueue(this.name, this.exchange, this.routingKey);
		}

		// OnInit callback
		this.onInit?.(this.channel, this.defaultQueue, {
			name: this.name,
			exchange: this.exchange,
			routingKey: this.routingKey,
			exchangeType: this.exchangeType
		});
	}

	abstract publish(data: T): Promise<void>;
	abstract consumer(): Promise<void>;

	async start() {
		/**** Call init func *****/
		await this.init();
		/**** Start consumer *****/
		await this.consumer();
	}
}
