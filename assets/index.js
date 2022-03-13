import './index.css';

const config = {
	bare: BARE_DIRECTORY,
	directory: TOMP_DIRECTORY,
};

if(PRODUCTION){
	config.loglevel = TOMPBoot.LOG_ERROR;
	config.codec = TOMPBoot.CODEC_XOR;
}else{
	config.loglevel = TOMPBoot.LOG_TRACE;
	config.codec = TOMPBoot.CODEC_PLAIN;
}

const boot = new TOMPBoot(config);

const search = new TOMPBoot.SearchBuilder('https://searx.ru/search?q=%s');

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