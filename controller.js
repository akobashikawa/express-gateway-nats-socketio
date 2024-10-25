class Controller {

    constructor({ service }) {
        this.service = service;
    }
    
    async hello(req, res) {
        const name = req.query.name;
        const message = await this.service.hello(name);
        res.send(message);
    }

    async productos(req, res) {
        const { method, params, query, body } = req;
        const productos = await this.service.requestReply({ subject: 'productos.requestReply', method, params, query, body });
        // const productos = await this.service.manualRequestReply({ subject: 'productos.request', responseSubject: 'productos.response', method, params, query, body });
        res.json(productos);
    }

    async personas(req, res) {
        const { method, params, query, body } = req;
        const personas = await this.service.requestReply({ subject: 'personas.requestReply', method, params, query, body });
        res.json(personas);
    }

    async ventas(req, res) {
        const { method, params, query, body } = req;
        const ventas = await this.service.requestReply({ subject: 'ventas.requestReply', method, params, query, body });
        res.json(ventas);
    }

}

module.exports = Controller;