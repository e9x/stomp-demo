import { Server as TOMPServer, XORCodec, LOG_TRACE, LOG_WARN } from '../toomanyproxies/Server/index.mjs';
import { Server as HTTPServer } from 'http';

export const tompserver = new TOMPServer({
	codec: XORCodec,
	noscript: true,
	prefix: '/tomp/',
	loglevel: LOG_TRACE,
});

export const httpserver = new HTTPServer();