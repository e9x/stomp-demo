import './index.css';

const config = {
	bare_server: BARE_DIRECTORY,
	directory: STOMP_DIRECTORY,
};

if (PRODUCTION) {
	config.loglevel = StompBoot.LOG_ERROR;
	config.codec = StompBoot.CODEC_XOR;
} else {
	config.loglevel = StompBoot.LOG_TRACE;
	config.codec = StompBoot.CODEC_PLAIN;
}

const boot = new StompBoot(config);

const search = new StompBoot.SearchBuilder('https://searx.ru/search?q=%s');

const form = document.querySelector('.main');
const input = document.querySelector('.main > input');
const error_node = document.querySelector('.error');

boot.ready.catch(error => {
	error_node.textContent = error.toString();
});

form.addEventListener('submit', async event => {
	event.preventDefault();

	await boot.ready;

	location.assign(boot.html(search.query(input.value)));
});
