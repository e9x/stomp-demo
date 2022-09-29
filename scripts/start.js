/**
 * Example of serving static files and running a bare server.
 * This is a very common setup.
 */
import createBareServer from '@tomphttp/bare-server-node';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { stompPath } from '@sysce/stomp';
import serveStatic from 'serve-static';

const httpServer = http.createServer();

// Run the Bare server in the /bare/ namespace. This will prevent conflicts between the static files and the bare server.
const bareServer = createBareServer('/bare/', {
	logErrors: false,
	localAddress: undefined,
	maintainer: {
		email: 'tomphttp@sys32.dev',
		website: 'https://github.com/tomphttp/',
	},
});

// The static root is usually relative to the main script in projects that use the Bare server.
// ie. if static.js is at /src/static.js, public will be /public/
// ideally, you will point the public directory relative to the current working directory
// serveStatic('./public/')
// This would ignore the relative location of static.js
const serve = serveStatic(
	fileURLToPath(new URL('../public/', import.meta.url)),
	{
		fallthrough: false,
	}
);

const serveStomp = serveStatic(stompPath, {
	fallthrough: false,
});

httpServer.on('request', (req, res) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeRequest(req, res);
	} else {
		if (req.url.startsWith('/stomp/')) {
			req.url = req.url.slice('/stomp/'.length);

			serveStomp(req, res, err => {
				res.writeHead(err?.statusCode || 500, {
					'Content-Type': 'text/plain',
				});
				res.end(err?.stack);
			});
		} else {
			serve(req, res, err => {
				res.writeHead(err?.statusCode || 500, {
					'Content-Type': 'text/plain',
				});
				res.end(err?.stack);
			});
		}
	}
});

httpServer.on('upgrade', (req, socket, head) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

httpServer.on('listening', () => {
	const address = httpServer.address();

	console.log(
		`HTTP server listening. View live at http://${
			address.family === 'IPv6' ? `[${address.address}]` : address.address
		}:${address.port}`
	);
});

// root <= 1024
const portMin = 1025;
const portMax = 65536;

const randomPort = () => ~~(Math.random() * (portMax - portMin)) + portMin;

const sleep = ms => new Promise(resolve => setTimeout(() => resolve(), ms));

const tryListen = port =>
	new Promise((resolve, reject) => {
		const cleanup = () => {
			httpServer.off('error', errorListener);
			httpServer.off('listening', listener);
		};

		const errorListener = err => {
			cleanup();
			reject(err);
		};

		const listener = () => {
			cleanup();
			resolve();
		};

		httpServer.on('error', errorListener);
		httpServer.on('listening', listener);

		httpServer.listen({
			port,
		});
	});

let port = parseInt(process.env.PORT || '');

if (isNaN(port)) port = 8080;

// ports to try before generating random ports
// remove duplicates using Set
const ports = [...new Set([port, 80, 8080, 3000])];

while (true) {
	try {
		await tryListen(port);
		break;
	} catch (err) {
		const newPort = ports.length > 0 ? ports.pop() : randomPort();

		console.error(
			`Port ${port} cannot be used. Binding to ${newPort} instead.`
		);

		port = newPort;

		// duration for user to view warnings:
		await sleep(1000);
	}
}
