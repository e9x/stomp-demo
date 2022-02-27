# TooManyProxies frontend

This repository is an example of hosting a [Bare Server](https://github.com/tomphttp/specifications/tree/master/BareServer.md) ([Bare-Server-Node](https://github.com/tomphttp/bare-server-node)) and serving the compiled [TooManyProxies](https://github.com/tomphttp/toomanyproxies) source using [Fastify](https://github.com/fastify/fastify).

## Usage

We provide a command-line interface for creating a frontend server.

For more features, specify the `--help` option when running the CLI.

## Wiki

Documentation for tests and other features can be found in [the wiki](https://github.com/tomphttp/toomanyproxies-frontend/wiki).

### Quickstart

1. Clone the required repositories locally
```sh
git clone https:/github.com/tomphttp/bare-server-node.git
git clone https:/github.com/tomphttp/toomanyproxies.git
git clone https:/github.com/tomphttp/toomanyproxies-frontend.git
```

2. Install dependencies for each repository
```sh
cd bare-server-node
npm install
cd ..

cd toomanyproxies
npm install
cd ..

cd toomanyproxies-frontend
npm install
cd ..
```

3. Enter the frontend repository (Again)
```sh
cd toomanyproxies-frontend
```

4. Start the server
```sh
node ./app.mjs --port 80 --host localhost
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
node ./app.mjs --port 443 --host localhost --tls --cert tls/cert.pem --key tls/key.pem
```