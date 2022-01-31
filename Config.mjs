import { LOG_TRACE } from '../toomanyproxies/Logger.mjs';

export const directory = '/bare/';

export const tomp_config = {
	noscript: false,
	bare: directory, // ran on same domain
	loglevel: LOG_TRACE,
};

export const tomp_directory = '/tomp/';