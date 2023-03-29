//import adapter from '@sveltejs/adapter-auto';
//import adapter from '@sveltejs/adapter-netlify';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// Set the path where the app will live here (starting but not ending with a '/')
		paths: {base: ''}
	}
};

export default config;
