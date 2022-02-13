import './index.css';
import { tomp_config } from '../Config.mjs';

const boot = new TOMPBoot(tomp_config);
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

	location.assign(boot.process(search.query(input.value)));
});