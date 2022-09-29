const config = {
	bare_server: '/bare/',
	directory: '/stomp/',
};

if (location.protocol === 'http:') {
	config.loglevel = StompBoot.LOG_TRACE;
	config.codec = StompBoot.CODEC_PLAIN;
} else {
	config.loglevel = StompBoot.LOG_ERROR;
	config.codec = StompBoot.CODEC_XOR;
}

const boot = new StompBoot(config);

const search = new StompBoot.SearchBuilder('https://searx.ru/search?q=%s');

const form = document.querySelector('.main');
const input = document.querySelector('.main > input');
const errorNode = document.querySelector('.error');

boot.ready.catch(error => {
	errorNode.textContent = error.toString();
});

form.addEventListener('submit', event => {
	event.preventDefault();
	boot.ready.then(() => location.assign(boot.html(search.query(input.value))));
});
