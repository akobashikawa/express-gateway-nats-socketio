# mseTienda Gateway Express

Gateway API para mseTienda, con ExpressJS, soporta NATS y SocketIO

## Install

### NATS

```sh
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats -m 8222
```

### Gateway

```sh
npm install
```

## Run

### NATS

```sh
docker start nats-server
```

### Gateway

```sh
npm run dev
# HTTP server running on port: 3000
# NATS connection to nats://localhost:4222: OK
# 
# NATS subscribed to frontend.test
# NATS listeners initialized

# test
nats pub frontend.test '{"message": "Hello World!"}'
# NATS client received message from frontend.test: Hello World!
# HANDLER of frontend.test
# IO emit nats-message frontend.test:  { message: 'Hello World!' }
```

### REPL

```sh
node repl.js
# dentro, se pueden ejecutar los métodos del service
await service.hello()
```
