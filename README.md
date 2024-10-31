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
# HTTP server running on port: 8080
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

## Con Docker y localhost

```sh
docker build -t tienda-gateway .

docker run --network="host" \
    -e PORT=8080 \
    -e NATS_URL=nats://localhost:4222 \
    --name tienda-gateway \
    tienda-gateway

# usando .env
docker run --network="host" --env-file .env --name tienda-gateway tienda-gateway

```

### Con docker-compose

- `Dockerfile` tiene una configuración para desarrollo standalone
- `Dockerfile-mse` tiene una configuración para desarrollo como microservicio, para ser invocado desde la carpeta principal de mseTienda

```sh
docker-compose up --build
docker-compose logs -f tienda-gateway
```