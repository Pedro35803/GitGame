import { config } from "dotenv";
config();

export const {
  JWT_SECRET,
  PORT,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  EMAIL_SERVICE_SMTP,
  PASS_SERVICE_SMTP,
  HOST_SERVICE_SMTP,
  PORT_SERVICE_SMTP,
} = process.env;

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET env variable");

if (
  !EMAIL_SERVICE_SMTP ||
  !PASS_SERVICE_SMTP ||
  !HOST_SERVICE_SMTP ||
  !PORT_SERVICE_SMTP
)
  throw new Error("Missing variables for email service");
