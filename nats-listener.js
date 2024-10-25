module.exports = ({ nats, io }) => {

    if (!nats) {
        throw new Error('NATS client is not available');
    }

    const sc = nats.sc;

    nats.subscribe('>', async (subject, payload) => {
        try {
            console.log(`NATS subscribe >, received payload from ${subject}: ${JSON.stringify(payload)}`);
            console.log(`NATS subscribe >, HANDLER of ${subject}`);
        } catch (error) {
            console.error(`NATS subscribe >, HANDLER of ${subject} error: `, error.message);
        }
    });

    nats.subscribe('frontend.>', async (subject, payload) => {
        try {
            console.log(`NATS subscribe frontend.>, received payload from ${subject}: ${JSON.stringify(payload)}`);
            console.log(`NATS subscribe frontend.>, HANDLER of ${subject}`);
            if (io) {
                io.emit(subject, payload);
                console.log(`NATS subscribe frontend.>, IO emit received nats message ${subject}: `, payload);
            }
        } catch (error) {
            console.error(`NATS subscribe frontend.>, HANDLER of ${subject} error: `, error.message);
        }
    });

    nats.subscribe('productos.requestReply', async (subject, payload, msg) => {
        try {
            console.log(`NATS subscribe productos.requestReply, received payload from ${subject}: ${JSON.stringify(payload)}`);
            console.log(`NATS subscribe productos.requestReply, HANDLER of ${subject}`);

            // Respuesta simulada de productos
            let result;

            switch (payload.method) {
                case 'GET':
                    const productos = [
                        { id: 1, nombre: 'Nuevo', costo: 10, precio: 20, cantidad: 30 },
                        { id: 2, nombre: 'Bonito', costo: 12, precio: 14, cantidad: 20 }
                    ];
                    result = sc.encode(JSON.stringify(productos));
                    break;
                default:
                    result = `${subject}: ${payload.method}`;
                    break;
            }

            // Publicamos la respuesta usando `msg.respond`
            msg.respond(result);
        } catch (error) {
            console.error(`NATS subscribe productos.requestReply, HANDLER of ${subject} error: `, error.message);
        }
    });

    nats.subscribe('productos.request', async (subject, payload, msg) => {
        try {
            console.log(`NATS subscribe productos.request, received payload from ${subject}: ${JSON.stringify(payload)}`);
            console.log(`NATS subscribe productos.request, HANDLER of ${subject}`);

            // Respuesta simulada de productos
            let result;

            switch (payload.method) {
                case 'GET':
                    const productos = [
                        { id: 1, nombre: 'Nuevo', costo: 10, precio: 20, cantidad: 30 },
                        { id: 2, nombre: 'Bonito', costo: 12, precio: 14, cantidad: 20 }
                    ];
                    result = productos;
                    break;
                default:
                    result = `${subject}: ${payload.method}`;
                    break;
            }

            // Publica la respuesta en el canal de respuesta
            nats.publish('productos.response', result);
        } catch (error) {
            console.error(`NATS subscribe productos.request, HANDLER of ${subject} error: `, error.message);
        }
    });

    console.log('NATS listeners initialized');
};