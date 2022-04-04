import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server as HTTPServer } from 'node:http';
import FastifyServer from 'fastify';
import FastifyStatic from 'fastify-static';
import BareServer from 'bare-server-node';
import TOMPBuilder from 'stomp';
import FrontendBuilder from '../Builder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function ({
	errors,
	stompDirectory,
	bareDirectory,
	host,
	port,
	skipBare,
	development,
}) {
	if (development) {
		console.log('Building in DEVELOPMENT mode');
	} else {
		console.log('Building in PRODUCTION mode');
	}

	const public_dir = join(__dirname, '..', 'public');

	{
		const builder_folder = join(public_dir);
		const builder = new FrontendBuilder(
			builder_folder,
			bareDirectory,
			stompDirectory,
			development
		);
		console.info('Created frontend builder on folder:', builder_folder);

		const emitter = builder.watch();

		emitter.on('error', errors => {
			for (let error of errors) {
				console.error(error);
			}

			console.error('Failure building frontend');
		});

		emitter.on('bulit', () => {
			console.log('Successfully built frontend');
		});
	}

	{
		const builder_folder = join(public_dir, stompDirectory);
		const builder = new TOMPBuilder(builder_folder, development);
		console.info('Created TOMP builder on folder:', builder_folder);

		const emitter = builder.watch();

		emitter.on('error', errors => {
			for (let error of errors) {
				console.error(error);
			}

			console.error('Failure building TOMP');
		});

		emitter.on('bulit', () => {
			console.log('Successfully built TOMP');
		});
	}

	const http = new HTTPServer();
	console.info('Created HTTP server.');

	let fastify_handler = () => {};

	const fastify = new FastifyServer({
		serverFactory(handler) {
			fastify_handler = handler;
			return http;
		},
	});

	fastify.register(FastifyStatic, {
		root: public_dir,
		list: {
			names: ['tests'],
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
					${dirs
						.map(
							file =>
								'<tr><td><a href=' +
								JSON.stringify('.' + file.href + '/') +
								'>' +
								file.name +
								'/</a></td></tr>'
						)
						.join('\n  ')}
					${files
						.map(
							file =>
								'<tr><td><a href=' +
								JSON.stringify('.' + file.href) +
								'>' +
								file.name +
								'</a></td></tr>'
						)
						.join('\n  ')}
				</tbody>
			</table>
		</body>
	</html>`,
		},
	});

	if (skipBare) {
		console.info(
			'Skipping creation of Bare Server. External Bare Server:',
			bareDirectory
		);

		http.on('request', fastify_handler);
	} else {
		const bare = new BareServer(bareDirectory, errors);
		console.info('Created Bare Server on directory:', bareDirectory);
		console.info('Error logging is', errors ? 'enabled.' : 'disabled.');

		http.on('request', (req, res) => {
			if (bare.route_request(req, res)) return;
			fastify_handler(req, res);
		});

		http.on('upgrade', (req, socket, head) => {
			if (bare.route_upgrade(req, socket, head)) return;
			socket.end();
		});
	}

	fastify.listen(port, host, (error, url) => {
		if (error) {
			throw error;
		}

		console.log('HTTP server listening. View live at', url);
	});
}
