import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), preprocess()],

	kit: {
		adapter: adapter(),
		alias: {
			'@components': 'src/components/index',
			'@components/*': 'src/components/*'
		}
	}
};

export default config;
