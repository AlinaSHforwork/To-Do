import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;

const app = express();

// Enable CORS for all routes
app.use(cors());

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});