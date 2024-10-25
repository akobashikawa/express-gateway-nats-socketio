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

    async productos(req) {
        const { method, params, query, body } = req;
        const subject = 'productos.request';
        console.log('service, productos', subject, { method, params, query, body });

        // Espera la respuesta de NATS en JSON
        const response = await this.nats.requestReply(subject, { method, params, query, body });
        return response;
    }

}

module.exports = Service;