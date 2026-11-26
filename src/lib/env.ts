import "server-only";
import { z } from "zod";

const schema = z.object({
  API_URL: z.string().url(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    "Invalid environment: set API_URL in .env.local, for example http://localhost:5000/api/v1"
  );
}

// Server only. The browser never sees the API address.
export const env = {
  API_URL: parsed.data.API_URL.replace(/\/+$/, ""),
};