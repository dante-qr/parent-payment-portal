import { createEnv } from "@t3-oss/env-core";
import { useRuntimeConfig } from "nitro/runtime-config";
import { z } from "zod";

const runtimeConfig = useRuntimeConfig();

console.log("===== env/server.ts =====");
console.log("runtimeConfig keys:", Object.keys(runtimeConfig));
console.log("runtimeConfig:", JSON.stringify(runtimeConfig, null, 2));
console.log(
	"process.env.DATABASE_URL:",
	(runtimeConfig.DATABASE_URL ?? process.env.DATABASE_URL)
		? "***SET***"
		: "UNDEFINED",
);
console.log(
	"process.env.BETTER_AUTH_SECRET:",
	(runtimeConfig.BETTER_AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET)
		? "***SET***"
		: "UNDEFINED",
);
console.log(
	"process.env.BETTER_AUTH_URL:",
	(runtimeConfig.BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL)
		? "***SET***"
		: "UNDEFINED",
);
console.log(
	"process.env.CORS_ORIGIN:",
	(runtimeConfig.CORS_ORIGIN ?? process.env.CORS_ORIGIN)
		? "***SET***"
		: "UNDEFINED",
);
console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
console.log(
	"process.env.VENDIS_API_URL:",
	(runtimeConfig.VENDIS_API_URL ?? process.env.VENDIS_API_URL)
		? "***SET***"
		: "UNDEFINED",
);
console.log(
	"process.env.VENDIS_API_KEY:",
	(runtimeConfig.VENDIS_API_KEY ?? process.env.VENDIS_API_KEY)
		? "***SET***"
		: "UNDEFINED",
);
console.log(
	"process.env.VENDIS_USER_TOKEN:",
	(runtimeConfig.VENDIS_USER_TOKEN ?? process.env.VENDIS_USER_TOKEN)
		? "***SET***"
		: "UNDEFINED",
);
console.log("===== end env/server.ts =====");

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
	},
	runtimeEnv: {
		DATABASE_URL: runtimeConfig.DATABASE_URL ?? process.env.DATABASE_URL,
		BETTER_AUTH_SECRET:
			runtimeConfig.BETTER_AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL:
			runtimeConfig.BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL,
		CORS_ORIGIN: runtimeConfig.CORS_ORIGIN ?? process.env.CORS_ORIGIN,
		NODE_ENV: runtimeConfig.NODE_ENV ?? process.env.NODE_ENV,
	},
	skipValidation:
		runtimeConfig.SKIP_ENV_VALIDATION ?? !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
