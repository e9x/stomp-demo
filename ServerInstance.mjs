import { Server as TOMPServer } from '../toomanyproxies/Server/index.mjs';
import { Server as HTTPServer } from 'http';
import { tompserver_config } from './Config.mjs';

import '../toomanyproxies/Compiler/index.mjs';

export const tompserver = new TOMPServer(tompserver_config);
export const httpserver = new HTTPServer();