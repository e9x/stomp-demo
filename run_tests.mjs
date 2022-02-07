import { TOMP } from '../toomanyproxies/TOMP.mjs';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { cwd } from 'node:process';
import { resolve, join } from 'node:path';
import { program, Option } from 'commander';

program
.requiredOption('-t, --test <path>', 'Path to an HTML file to test')
.option('-d, --dont-unwrap', 'If the test will be unwrapped')
;

program.parse(process.argv);

const options = program.opts();

const tomp = new TOMP({
	directory: '/',
	bare: '/',
});

options.test = resolve(cwd(), options.test);
console.log('Using test:', options.test);

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
	const html = await readFile(options.test, 'utf-8');
	
	const rewritten = tomp.html.wrap(html, base);
	
	console.log(`${fg_red}${bright}Wrapped ${'/'.repeat(30)}:`, reset);
	console.log(`${indent(rewritten, 1, '\t')}`, reset);
	
	if(!options.dontUnwrap){
		const unrewritten = tomp.html.unwrap(rewritten, base);
		console.log(`${fg_green}${bright}Unwrapped ${'/'.repeat(30)}:`, reset);
		console.log(`${indent(unrewritten, 1, '\t')}`, reset);
	}
}();