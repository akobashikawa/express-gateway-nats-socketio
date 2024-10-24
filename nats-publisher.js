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

// Método para publicar sin esperar respuesta
async function publish(subject, data) {
    const responseSubject = `${subject}.response`;

    try {
        if (!nc) {
            await initNats();
        }
        const payload = sc.encode(JSON.stringify(data));
        nc.publish(subject, payload, { reply: responseSubject });
        console.log(`NATS published message to ${subject}: ${JSON.stringify(data)}`);
    } catch (error) {
        console.error(`NATS failed to publish message to ${subject}: ${error.message}`);
    }
}

// Método para suscribirse a un tema
async function subscribe(subject, handler) {
    try {
        if (!nc) {
            await initNats();
        }
    
        const subscription = nc.subscribe(subject, {
            callback: async (err, msg, reply, subSubject, sid) => {
                if (err) {
                    console.error(`NATS error in subscription to ${subject}: ${err.message}`);
                    return;
                }
                const payload = JSON.parse(sc.decode(msg.data));
                await handler(subSubject, payload);
            },
        });
    
        console.log(`NATS subscribed to ${subject}`);
        return subscription;
    } catch (error) {
        console.error(`NATS failed to subscribe to ${subject}: ${error.message}`);
        return null;
    }
}

module.exports = {
    initNats,
    sc,
    nc,
    publish,
    subscribe,
};