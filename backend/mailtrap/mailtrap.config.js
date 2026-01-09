import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.MAILTRAP_ENDPOINT,
});

export const sender = {
  email: process.env.MAILTRAP_SENDER_EMAIL,
  name: process.env.MAILTRAP_SENDER_NAME,
};