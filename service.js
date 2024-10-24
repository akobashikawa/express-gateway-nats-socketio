class Service {

    constructor({ nats }) {
        this.nats = nats;
    }

    async ensureNatsConnection() {
        if (!this.nats.nc) {
            await this.nats.initNats();
        }
    }

    async pub(subject, data) {
        this.nats.publish(subject, data);
        return data;
    }

    async hello(name = 'World') {
        await this.ensureNatsConnection();
        const message = `Hello ${name}!`;
        this.nats.publish('hello.done', { message });
        return message;
    }

}

module.exports = Service;