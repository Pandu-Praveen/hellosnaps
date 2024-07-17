import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte"],
	preprocess: [vitePreprocess()],

	vitePlugin: {
		inspector: true
	},
	kit: {
		adapter: adapter({
			fallback: "index.html",
			pages: "/var/www/html/hellosnaps",
			assets: "/var/www/html/hellosnaps"
		})
	}
};
export default config;
