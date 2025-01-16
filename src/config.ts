import dotenv from 'dotenv';

dotenv.config();

// Check that the required environment variables are defined
if (!process.env.DB_Url || !process.env.jwt_secret) {
  throw new Error("Missing required environment variables: DB_Url or jwt_secret");
}

// Type the environment variables properly
const dbUrl = process.env.DB_Url as string;   // Cast to string
const jwtSecret = process.env.jwt_secret as string;  // Cast to string

// Define the config object with the correct types
interface Config {
  connection: string;
  JWT_PASSWORD: string;
}

export const config: Config = {
  connection: dbUrl,
  JWT_PASSWORD: jwtSecret,
};
