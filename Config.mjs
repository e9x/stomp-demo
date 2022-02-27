import { LOG_TRACE } from '../toomanyproxies/Logger.mjs';

export const bare_directory = '/bare/';
export const tomp_directory = '/tomp/';

export const tomp_config = {
	noscript: false,
	bare: bare_directory, // ran on same domain
	loglevel: LOG_TRACE,
};