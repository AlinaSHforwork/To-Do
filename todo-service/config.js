import dotenv from 'dotenv';
import cors from 'cors'; // Add CORS import
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;

