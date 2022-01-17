import path from 'path';
import { fileURLToPath } from 'node:url';
import { httpserver, tompserver } from './ServerInstance.mjs';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
export * from './Compiler.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var fastify_handler = () => {};

httpserver.on('request', (req, res) => {
	if(req.url.startsWith(tompserver.tomp.prefix))tompserver.request(req, res);
	else fastify_handler(req, res);
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

fastify.register(FastifyStatic, { root: path.join(__dirname, 'public') });

fastify.listen(80, (error, url) => {
	if(error){
		throw new Error(error);
	}else{
		console.log('Listening on', url);
	}
});