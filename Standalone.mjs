import { program, Option } from 'commander';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
import { Server as BareServer } from '../bare-server-node/Server.mjs';
import { Server as HTTPServer } from 'node:http';
import { Server as TLSHTTPServer } from 'node:https';
import { Builder } from '../toomanyproxies/Builder.mjs';
import { bare_directory, tomp_directory } from './Config.mjs';
import './Builder.mjs';

const default_port = Symbol();

program
.addOption(new Option('-bd, --bare-directory <URL>', 'Bare URL directory.').default('/bare/'))
.addOption(new Option('-td, --tomp-directory <URL>', 'TOMP directory.').default('/tomp/'))
.addOption(new Option('-h, --host <string>', 'Hostname to listen on').default('localhost').env('PORT'))
.addOption(new Option('-p, --port <number>', 'Port to listen on').default(default_port).env('PORT'))
.addOption(new Option('--tls', 'use HTTPS (TLS/SSL)'))
.addOption(new Option('--cert <string>', 'certificate for TLS').default(''))
.addOption(new Option('--key <string>', 'key for TLS').default(''))
;

program.parse(process.argv);

const options = program.opts();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bare = new BareServer(options.bareDirectory);
console.info('Created bare server on directory:', options.bareDirectory);

let http;

if(options.tls){
	const tls = {};
	
	if(options.key !== ''){
		options.key = resolve(cwd(), options.key);
		console.info('Reading key from file:', options.key);
		tls.key = await readFile(options.key);
	}

	if(options.cert !== ''){
		options.cert = resolve(cwd(), options.cert);
		console.info('Reading certificate from file:', options.cert);
		tls.cert = await readFile(options.cert);
	}
	
	http = new TLSHTTPServer(tls);
	console.info('Created TLS HTTP server.');
}else{
	http = new HTTPServer();
	console.info('Created HTTP server.');
}

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

if(options.port === default_port){
	if(options.tls){
		options.port = 443;
	}else{
		options.port = 80;
	}
}

http.on('listening', () => {
	console.log(`HTTP server listening. View live at ${options.tls ? 'https:' : 'http:'}//${options.host}:${options.port}`);
});

http.listen({
	host: options.host,
	port: options.port,
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

const builder_folder = join(public_dir, options.tompDirectory);
const builder = new Builder(builder_folder);
const emitter = builder.watch();
console.info('Created builder on folder:', builder_folder);

emitter.on('error', errors => {
	for(let error of errors){
		console.error(error);
	}

	console.error('Failure building TOMP');
});

emitter.on('bulit', () => {
	console.log('Successfully built TOMP');
});