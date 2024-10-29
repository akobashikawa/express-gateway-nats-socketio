# mseTienda Gateway Express

Gateway API para mseTienda, con ExpressJS, soporta NATS y SocketIO

## Run NATS server

```sh
docker run -d --name nats-server -p 4222:4222

nats server check connection -s nats://localhost:4222
```

## Run gateway

```sh
npm install
npm run dev
# HTTP server running on port: 3000
# NATS connection to nats://localhost:4222: OK
# 
# NATS subscribed to frontend.test
# NATS listeners initialized

nats pub frontend.test '{"message": "Hello World!"}'
# NATS client received message from frontend.test: Hello World!
# HANDLER of frontend.test
# IO emit nats-message frontend.test:  { message: 'Hello World!' }
```



## Run repl

```sh
node repl.js
# dentro, se pueden ejecutar los métodos del service
await service.hello()
```
