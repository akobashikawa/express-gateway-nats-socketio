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
        const productos = await this.service.productos({ method, params, query, body });
        res.json(productos);
    }

    async personas(req, res) {
        const personas = await this.service.personas();
        res.json(personas);
    }

    async ventas(req, res) {
        const ventas = await this.service.ventas();
        res.json(ventas);
    }

}

module.exports = Controller;