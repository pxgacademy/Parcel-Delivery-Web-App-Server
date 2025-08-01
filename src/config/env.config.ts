import dotenv from "dotenv";
import { EnvRecord, envValidator } from "../app/utils/envValidator";
dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URL: string;
  FRONTEND_URL: string;
  EXPRESS_SESSION_SECRET: string;
  BCRYPT_SALT_ROUND: number;
  JWT: {
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_TOKEN_PERIOD: string;
    JWT_REFRESH_TOKEN_PERIOD: string;
  };
  NODEMAILER: {
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_FROM: string;
    SMTP_PASS: string;
  };
  GOOGLE: {
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CALLBACK_URL: string;
  };
}

const ENV: EnvConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URL: process.env.MONGODB_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
  BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND),
  JWT: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_TOKEN_PERIOD: process.env.JWT_TOKEN_PERIOD,
    JWT_REFRESH_TOKEN_PERIOD: process.env.JWT_REFRESH_TOKEN_PERIOD,
  },
  NODEMAILER: {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_PASS: process.env.SMTP_PASS,
  },
  GOOGLE: {
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  },
} as EnvConfig;

// env validator, if env undefined, it returns an error
envValidator(ENV as unknown as Record<string, string | EnvRecord>);

export const isDev = ENV.NODE_ENV === "development";

export default ENV;
