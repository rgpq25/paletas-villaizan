import { z } from "zod";

export const configSchema = z.object({
	PORT: z.string().transform(Number).default("3000"),
	JWT_SECRET_KEY: z.string().min(10),
	JWT_REFRESH_TOKEN_KEY: z.string().min(10),
});

export type AppConfig = z.infer<typeof configSchema>;
