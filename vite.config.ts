import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import pkg from "./package.json";

const config = defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		process.env.NODE_ENV === "production" &&
			nitro({
				preset: "aws-amplify",
				runtimeConfig: {
					VENDIS_API_URL: process.env.VENDIS_API_URL,
					VENDIS_API_KEY: process.env.VENDIS_API_KEY,
					VENDIS_USER_TOKEN: process.env.VENDIS_USER_TOKEN,
					NODE_ENV: process.env.NODE_ENV,
				},
				rollupConfig: { external: [/^@sentry\//] },
			}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
