import path from 'path';
import { Server as HTTPServer } from 'http';
import { Server as TOMPServer, XORCodec, LOG_TRACE, LOG_WARN } from '../toomanyproxies/Server/index.mjs';
import { fileURLToPath } from 'node:url';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
import './Compiler.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var fastify_handler = () => {};

const http = new HTTPServer((req, res) => {
	if(req.url.startsWith(tompserver.tomp.prefix))tompserver.request(req, res);
	else fastify_handler(req, res);
}).on('upgrade', (req, socket, head) => {
	tomp.upgrade(req, socket, head);
});

const tompserver = new TOMPServer({
	codec: XORCodec,
	loglevel: LOG_TRACE, // in prod, use LOG_WARN,
});

/*tompserver.tomp.log.trace('Trace');
tompserver.tomp.log.debug('Debug');
tompserver.tomp.log.info('Info');
tompserver.tomp.log.warn('Warn');
tompserver.tomp.log.error('Error');*/

const fastify = new FastifyServer({
	serverFactory(handler){
		fastify_handler = handler;
		return http;
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