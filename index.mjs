import path from 'path';
import { fileURLToPath } from 'node:url';
import { httpserver, tompserver } from './ServerInstance.mjs';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
import { tomp_directory } from './Config.mjs';
export * from './Compiler.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var fastify_handler = () => {};

httpserver.on('request', (req, res) => {
	if(tompserver.route_request(req, res))return;
	fastify_handler(req, res);
});

httpserver.on('upgrade', (req, socket, head) => {
	tomp.upgrade(req, socket, head);
});

const fastify = new FastifyServer({
	serverFactory(handler){
		fastify_handler = handler;
		return httpserver;
	},
});

fastify.register(FastifyStatic, {
	root: path.join(__dirname, 'public'),
});

fastify.register(FastifyStatic, {
	root: path.join(__dirname, '..', 'toomanyproxies', 'Compiler', 'public'),
	prefix: tomp_directory,
	decorateReply: false,
});

fastify.listen(80, (error, url) => {
	if(error){
		throw new Error(error);
	}else{
		console.log('Listening on', url);
	}
});