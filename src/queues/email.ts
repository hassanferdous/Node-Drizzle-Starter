import BaseMQ, { MQConfigType } from "@/mq/BaseMQ";

class EmailWorker extends BaseMQ<any> {
	constructor(config: MQConfigType) {
		super(config);
	}

	async publish() {}
	async consumer() {
		console.log("starter consumer");
	}
}

export const emailWorker = new EmailWorker({
	name: "email.queue",
	exchange: "email.exchange",
	routingKey: "email.routingKey"
});
