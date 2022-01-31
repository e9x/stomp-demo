import { Server as TOMPServer } from '../bare-server-node/Server.mjs';
import { Server as HTTPServer } from 'http';
import { directory } from './Config.mjs';

import '../toomanyproxies/Compiler/index.mjs';

export const tompserver = new TOMPServer(directory);
export const httpserver = new HTTPServer();