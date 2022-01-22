import { LOG_TRACE, LOG_WARN } from '../toomanyproxies/Logger.mjs';

export const tompserver_config = {
	prefix: '/bare/',
	tompserver_config: LOG_TRACE,
};

export const tomp_config = {
	noscript: false,
	bare: tompserver_config.prefix, // ran on same domain
	loglevel: LOG_TRACE,
};

export const tomp_directory = '/tomp/';