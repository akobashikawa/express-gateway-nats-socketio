const { connect, StringCodec } = require('nats');

const sc = StringCodec();
let nc;
let io;

async function initNats(app = null) {
    if (nc) {
        return nc;
    }
    const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
    try {
        nc = await connect({ servers: NATS_URL });
        console.log(`NATS connection to ${NATS_URL}: OK`);

        if (app) {
            io = app.get('io');
        }

        return nc;
    } catch (error) {
        console.error(`NATS connection to ${NATS_URL}: ${error.message}`);
        return null;
    }
}

// Función para publicar sin esperar respuesta
async function publish(subject, data) {
    try {
        if (!nc) {
            await initNats();
        }
        const payload = sc.encode(JSON.stringify(data));
        nc.publish(subject, payload);
        console.log(`NATS publish, published message to ${subject}`);
    } catch (error) {
        console.error(`NATS publish, failed to publish message to ${subject}: ${error.message}`);
    }
}

// Función para request-reply
async function requestReply(subject, data) {
    try {
        if (!nc) {
            await initNats();
        }
        const payload = sc.encode(JSON.stringify(data));
        const timeout = 5000; // Tiempo máximo de espera en milisegundos

        // Enviamos la solicitud y esperamos la respuesta
        console.log(`NATS requestReply, received request from ${subject}:`, data, sc.decode(payload));
        const message = await nc.request(subject, payload, { timeout });
        const response = JSON.parse(sc.decode(message.data));

        console.log(`NATS requestReply, received reply from ${subject}:`, response);
        return response;
    } catch (error) {
        console.error(`NATS requestReply, failed request-reply to ${subject}: ${error.message}`);
        return null;
    }
}

// Función para suscribirse a un tema y escuchar mensajes
async function subscribe(subject, handler) {
    try {
        if (!nc) {
            await initNats();
        }
    
        const subscription = nc.subscribe(subject, {
            callback: async (err, msg) => {
                if (err) {
                    console.error(`NATS subscribe, error in subscription to ${subject}: ${err.message}`);
                    return;
                }
                let payload;
                try {
                    payload = JSON.parse(sc.decode(msg.data));
                } catch (error) {
                    payload = {text: sc.decode(msg.data)};
                }
                const msgSubject = msg.subject; 
                await handler(msgSubject, payload, msg);
            },
        });
    
        console.log(`NATS subscribe, subscribed to ${subject}`);
        return subscription;
    } catch (error) {
        console.error(`NATS subscribe, failed to subscribe to ${subject}: ${error.message}`);
        return null;
    }
}

module.exports = {
    initNats,
    sc,
    nc,
    publish,
    subscribe,
    requestReply,
};