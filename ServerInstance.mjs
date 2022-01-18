import { Server as TOMPServer, XORCodec, LOG_TRACE, LOG_WARN } from '../toomanyproxies/Server/index.mjs';
import { Development } from '../toomanyproxies/WebpackUtil.mjs';
import { Server as HTTPServer } from 'http';

export const tompserver = new TOMPServer({
	codec: XORCodec,
	noscript: true,
	prefix: '/tomp/',
	loglevel: Development ? LOG_TRACE : LOG_WARN,
});

export const httpserver = new HTTPServer();