# SystemYA TOMP Frontend

This repository is an example of hosting a [Bare Server](https://github.com/tomphttp/specifications/tree/master/BareServer.md) ([Bare-Server-Node](https://github.com/tomphttp/bare-server-node)) and serving our [TOMP implementation](https://github.com/sysce/tomp) using [Fastify](https://github.com/fastify/fastify).

## Usage

We provide a command-line interface for creating a frontend server.

For more features, specify the `--help` option when running the CLI.

## Wiki

Documentation for tests and other features can be found in [the wiki](https://github.com/sysce/tomp-demo/wiki).

### Quickstart

1. Clone the repository
```sh
git clone https:/github.com/sysce/tomp-demo.git
cd tomp-demo
```

2. Install dependencies
```sh
npm install
```

4. Start the server
```sh
npm start --port 80 --host localhost
```

### TLS

In the cloned repository (See [quickstart](#quickstart))

1. Generate OpenSSL certificates (Unless you're bringing your own)
```sh
mkdir tls
openssl genrsa -out tls/key.pem
openssl req -new -key tls/key.pem -out tls/csr.pem
openssl x509 -req -days 9999 -in tls/csr.pem -signkey tls/key.pem -out tls/cert.pem
```

2. Start the server
```sh
node ./app.js --port 443 --host localhost --tls --cert tls/cert.pem --key tls/key.pem
```