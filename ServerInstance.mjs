import { Server as TOMPServer, XORCodec, LOG_TRACE, LOG_WARN } from '../toomanyproxies/Server/index.mjs';
import { Server as HTTPServer } from 'http';

export const tompserver = new TOMPServer({
	codec: XORCodec,
	noscript: true,
	prefix: '/tomp/',
	loglevel: LOG_TRACE, // in prod, use LOG_WARN,
});

export const httpserver = new HTTPServer();