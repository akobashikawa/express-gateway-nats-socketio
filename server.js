const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const nats = require('./nats-publisher');

const NAME = process.env.NAME || 'Gateway NATS SocketIO';
const PORT = process.env.PORT || 3000;

// Crear servidor HTTP para Socket.IO
const server = http.createServer(app);

// Inicializar Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Configura el CORS según tu necesidad
        methods: ["GET", "POST"]
    }
});

// Compartir la instancia de io en toda la app
app.set('io', io);

// Iniciar la conexión con NATS
nats.initNats(app)
    .then((nc) => {
        const natsListener = require('./nats-listener');
        natsListener({ nats, io });
    });


// Manejar las conexiones socket desde los clientes
io.on('connection', (socket) => {
    console.log('IO Client connected');

    socket.on('disconnect', () => {
        console.log('IO Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`${NAME}`);
    console.log(`HTTP server running on port: ${PORT}`);
});

server.on('error', (err) => {
    console.error(`HTTP server error: ${err}`);
});

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown(signal) {
    if (signal) {
        console.log(`\nReceived signal: ${signal}`);
        console.log('HTTP server Gracefully closing...');
    }

    server.close((err) => {
        if (err) {
            console.error('HTTP server error', err.message);
            process.exit(1);
        } else {
            console.log('HTTP server closed successfully');
            console.log('\nbye, bye!');
            process.exit(0);
        }
    });
}

