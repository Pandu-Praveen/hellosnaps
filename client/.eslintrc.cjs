module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:svelte/recommended",
		"prettier"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		extraFileExtensions: [".svelte"]
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser"
			}
		}
	],
	rules: {
	  indent: "off",
	  "linebreak-style": ["error", "windows"],
	  quotes: ["error", "double"],
	  semi: ["error", "always"],
	  "no-cond-assign": "off",
	  "@typescript-eslint/no-explicit-any": "off",
	  "@typescript-eslint/no-inferrable-types": "off",
	  "@typescript-eslint/no-non-null-assertion": "off",
	},
};
