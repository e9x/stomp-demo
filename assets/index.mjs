import './index.css';

const form = document.querySelector('.main');
const input = document.querySelector('.main > input');
const error_node = document.querySelector('.error');

window.tomp.catch(error => {
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

form.addEventListener('submit', event => {
	event.preventDefault();
	
	window.tomp.then(bootstrapper => {
		const url = resolve_url(input.value);
		location.assign(bootstrapper.process(url));
	});
});