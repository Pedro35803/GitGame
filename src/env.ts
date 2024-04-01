import { config } from "dotenv";
config();

export const { JWT_SECRET, PORT, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET env variable");
