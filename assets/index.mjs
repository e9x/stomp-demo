import './index.css';
import { tomp_config } from '../Config.mjs';

const bootstrapper = new TompBootstrapper(tomp_config);

const form = document.querySelector('.main');
const input = document.querySelector('.main > input');
const error_node = document.querySelector('.error');

bootstrapper.ready.catch(error => {
	error_node.textContent = error.toString();
});

const whitespace = /\s/;
const http_s_protocol = /^https?:\/\//;

function resolve_url(input){
	if(input.includes('.') && !input.match(http_s_protocol)){
		return `http://${input}`;
	}else if(input.match(whitespace) || !input.match(http_s_protocol)) {
		return `https://www.google.com/search?q=${encodeURIComponent(input)}`;
	}else{
		return input;
	}
}

form.addEventListener('submit', async event => {
	event.preventDefault();
	
	await bootstrapper.ready;

	const url = resolve_url(input.value);
	location.assign(bootstrapper.process(url));
});