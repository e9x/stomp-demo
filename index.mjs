import path from 'path';
import { fileURLToPath } from 'node:url';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
import { Server as BareServer } from '../bare-server-node/Server.mjs';
import { Server as HTTPServer } from 'http';
import { Builder } from '../toomanyproxies/Builder.mjs';
import { bare_directory, tomp_directory } from './Config.mjs';
import './Builder.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bare = new BareServer(bare_directory);
const http = new HTTPServer();

let fastify_handler = () => {};

http.on('request', (req, res) => {
	if(bare.route_request(req, res))return;
	fastify_handler(req, res);
});

http.on('upgrade', (req, socket, head) => {
	if(bare.route_upgrade(req, socket, head))return;
	socket.end();
});

const fastify = new FastifyServer({
	serverFactory(handler){
		fastify_handler = handler;
		return http;
	},
});

const public_dir = path.join(__dirname, 'public');

fastify.register(FastifyStatic, {
	root: public_dir,
});

const builder = new Builder(path.join(public_dir, tomp_directory));
const emitter = builder.watch();

emitter.on('error', errors => {
	for(let error of errors){
		console.error(error);
	}

	console.error('Failure building TOMP');
});

emitter.on('bulit', () => {
	console.error('Successfully built TOMP');
});

fastify.listen(80, (error, url) => {
	if(error){
		throw new Error(error);
	}else{
		console.log('Listening on', url);
	}
});