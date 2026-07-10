import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env/server";

function debugHandler() {
	const serverEnv = {
		DATABASE_URL: env.DATABASE_URL || "UNDEFINED",
		BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET || "UNDEFINED",
		BETTER_AUTH_URL: env.BETTER_AUTH_URL || "UNDEFINED",
		CORS_ORIGIN: env.CORS_ORIGIN || "UNDEFINED",
		NODE_ENV: env.NODE_ENV || "UNDEFINED",
		SKIP_ENV_VALIDATION: process.env.SKIP_ENV_VALIDATION || "UNDEFINED",
	};

	console.log("===== /api/debug-env =====");
	console.log("processEnv:", JSON.stringify(serverEnv, null, 2));
	console.log("===== end /api/debug-env =====");

	return new Response(
		JSON.stringify(
			{
				message: "DEBUG ENV INFO - Check server logs too",
				processEnv: serverEnv,
			},
			null,
			2,
		),
		{
			headers: { "Content-Type": "application/json" },
		},
	);
}

export const Route = createFileRoute("/api/debug-env")({
	server: {
		handlers: {
			GET: debugHandler,
		},
	},
});
