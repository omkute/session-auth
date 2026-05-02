import { z } from "zod";

// Define schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "PORT must be a number",
    })
    .default(3000),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(10, "JWT_SECRET must be at least 10 characters"),
});

// Parse and validate
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

// Export typed config
export const config = {
  env: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  databaseUrl: parsed.data.DATABASE_URL,
  jwtSecret: parsed.data.JWT_SECRET,
};
