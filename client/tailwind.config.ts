import { join } from "path";
import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { skeleton } from "@skeletonlabs/tw-plugin";
import { myCustomTheme } from "./myTheme";

export default {
	darkMode: "class",
	content: ["./src/**/*.{html,js,svelte,ts}", join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}")],
	theme: {
		extend: {},
	},
	plugins: [
		typography,
		skeleton({
			themes: {
				custom: [
					myCustomTheme
				]
			},
		}),
	],
} satisfies Config;
