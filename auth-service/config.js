import dotenv from 'dotenv';
import cors from 'cors'; // Add CORS import

dotenv.config();

let uri = process.env.MONGO_URI;

// 2. If empty/undefined, force the internal Docker URL
if (!uri) {
    console.log("⚠️  MONGO_URI is missing. Using default Docker URL.");
}

export const MONGO_URI = uri;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET 