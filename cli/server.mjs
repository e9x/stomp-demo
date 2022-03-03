import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server as HTTPServer } from 'node:http';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
import BareServer from '../../bare-server-node/Server.mjs';
import TOMPBuilder from '../../toomanyproxies/Builder.mjs';
import FrontendBuilder from '../Builder.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function({ errors, tompDirectory, bareDirectory, host, port }){
	const public_dir = join(__dirname, '..', 'public');
	
	{
		const builder_folder = join(public_dir);
		const builder = new FrontendBuilder(builder_folder);
		console.info('Created frontend builder on folder:', builder_folder);
		
		const emitter = builder.watch();
		
		emitter.on('error', errors => {
			for(let error of errors){
				console.error(error);
			}
		
			console.error('Failure building frontend');
		});
		
		emitter.on('bulit', () => {
			console.log('Successfully built frontend');
		});
	}
	
	{
		const builder_folder = join(public_dir, tompDirectory);
		const builder = new TOMPBuilder(builder_folder);
		console.info('Created TOMP builder on folder:', builder_folder);
		
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
	}
	
	const bare = new BareServer(bareDirectory, errors);
	console.info('Created Bare Server on directory:', bareDirectory);
	console.info('Error logging is', errors ? 'enabled.' : 'disabled.');
	
	const http = new HTTPServer();
	console.info('Created HTTP server.');
	
	let fastify_handler = () => {};
	
	const fastify = new FastifyServer({
		serverFactory(handler){
			fastify_handler = handler;
			return http;
		},
	});
	
	fastify.register(FastifyStatic, {
		root: public_dir,
		list: {
			names: [ 'tests' ],
			format: 'html',
			render: (dirs, files) =>
	`<!DOCTYPE HTML>
	<html>
		<head>
			<meta charset="utf-8" />
			<title>Directory Listing</title>
			</head>
		<body>
			<h1>Directory Listing</h1>
			<hr />
			<table>
				<thead>
					<tr>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					${dirs.map(file => '<tr><td><a href=' + JSON.stringify('.' + file.href + '/') + '>' + file.name + '/</a></td></tr>').join('\n  ')}
					${files.map(file => '<tr><td><a href=' + JSON.stringify('.' + file.href) + '>' + file.name + '</a></td></tr>').join('\n  ')}
				</tbody>
			</table>
		</body>
	</html>`,
		},
	});
	
	http.on('request', (req, res) => {
		if(bare.route_request(req, res))return;
		fastify_handler(req, res);
	});
	
	http.on('upgrade', (req, socket, head) => {
		if(bare.route_upgrade(req, socket, head))return;
		socket.end();
	});
	
	fastify.listen(port, host, (error, url) => {
		if(error){
			throw error;
		}
	
		console.log('HTTP server listening. View live at', url);
	});
}