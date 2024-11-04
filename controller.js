class Controller {

    constructor({ service }) {
        this.service = service;
    }

    async hello(req, res) {
        const name = req.query.name;
        const message = await this.service.hello(name);
        res.send(message);
    }

    async restToService(req, res) {
        const { method, params, query, body } = req;
        console.log(params)
        // Dividir la cadena en partes
        const parts = params[0].split('/');
        const serviceName = parts[0]; // El primer elemento es el nombre del servicio

        // Crear un objeto para newParams
        const newParams = {};
        parts.slice(1).forEach((param, index) => {
            if (param) {
                newParams[index] = param;
            }
        });
        const productos = await this.service.requestReply({ subject: `${serviceName}.requestReply`, method, params: newParams, query, body });
        // const productos = await this.service.manualRequestReply({ subject: 'productos.request', responseSubject: 'productos.response', method, params, query, body });
        res.json(productos);
    }

}

module.exports = Controller;