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
        const productos = [];
        res.json(productos);
    }

    async personas(req, res) {
        const personas = [];
        res.json(personas);
    }

    async ventas(req, res) {
        const ventas = [];
        res.json(ventas);
    }

}

module.exports = Controller;