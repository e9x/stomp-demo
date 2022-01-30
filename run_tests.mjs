import { TOMP } from '../toomanyproxies/TOMP.mjs';
import { fileURLToPath } from 'node:url';
import fsp from 'node:fs/promises';
import {basename, dirname,join} from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const tomp = new TOMP({
	directory: '/',
	bare: '/',

});

const entries_dir = join(__dirname, 'public', 'Tests');

const pick = 'Anchor';
const base = new URL('https://www.sys32.dev/');

const fg_red = `\x1b[31m`;
const fg_green = `\x1b[32m`;
const bright = `\x1b[1m`;
const reset = `\x1b[0m`;

function indent(text, amount, char){
	let result = text.split('\n');

	for(let i = 0; i < result.length; i++){
		result[i] = char.repeat(amount) + result[i];
	}

	return result.join('\n');
}

void async function(){
	const html = await fsp.readFile(join(entries_dir, pick + '.html'), 'utf-8');
	
	const rewritten = tomp.html.wrap(html, base);
	const unrewritten = tomp.html.unwrap(rewritten, base);

	console.log(`${fg_red}${bright}Wrapped ${'/'.repeat(30)}:`, reset);
	console.log(`${indent(rewritten, 1, '\t')}`, reset);
	console.log(`${fg_green}${bright}Unwrapped ${'/'.repeat(30)}:`, reset);
	console.log(`${indent(unrewritten, 1, '\t')}`, reset);
}();