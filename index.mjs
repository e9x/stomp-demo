import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
import { Server as BareServer } from '../bare-server-node/Server.mjs';
import { Server as HTTPServer } from 'node:http';
import { Builder } from '../toomanyproxies/Builder.mjs';
import { bare_directory, tomp_directory } from './Config.mjs';
import { staticList } from '../fastify-static-chromium-list/index.mjs';
import './Builder.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

const public_dir = join(__dirname, 'public');

fastify.register(FastifyStatic, {
	root: public_dir,
	list: {
		names: [ 'tests' ],
		format: 'html',
		render: (dirs, files) => 
			'<!DOCTYPE HTML><html><head><meta charset="utf-8" /></head><body>'
 			+ '<ul>' + dirs.map(dir => `<li><a href=".${dir.href}">${dir.name}</a></li>`).join('\n  ') + '</ul>'
			+ '<ul>' + files.map(file => `<li><a href=".${file.href}">${file.name}</a></li>`).join('\n  ') + '</ul>'
	  		+ '</body></html>',
	},
});

// onHasParentDirectory

const builder = new Builder(join(public_dir, tomp_directory));
const emitter = builder.watch();

emitter.on('error', errors => {
	for(let error of errors){
		console.error(error);
	}

	console.error('Failure building TOMP');
});

emitter.on('bulit', () => {
	console.log('Successfully built TOMP');
});

fastify.listen(80, (error, url) => {
	if(error){
		throw new Error(error);
	}else{
		console.log('Listening on', url);
	}
});