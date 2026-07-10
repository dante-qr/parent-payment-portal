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
	ssr: {
		external: ["better-auth"],
	},
	plugins: [
		devtools(),
		process.env.NODE_ENV === "production" &&
			nitro({
				preset: "aws-amplify",
				runtimeConfig: {
					DATABASE_URL: process.env.DATABASE_URL,
					BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
					BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
					CORS_ORIGIN: process.env.CORS_ORIGIN,
					SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION,
					NODE_ENV: process.env.NODE_ENV,
				},
				rollupConfig: {
					external: [/^@sentry\//],
				},
			}),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
