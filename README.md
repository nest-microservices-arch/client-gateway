<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Client gateway
the gateway is the main entry point for the client. it is responsible for routing requests to the appropriate service.

## Dev
1. clone the repository
2. run `npm install` to install the dependencies
3. create a `.env` file based on the `.env.example` file
4. run `npm run start:dev` to start the server


## Nats
````
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
````
