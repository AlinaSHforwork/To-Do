import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { MONGO_URI } from './config.js';

const JWT_SECRET = 'your_super_secret_key'; // MUST MATCH TODO SERVICE
const PORT = process.env.PORT ; 

console.log("Attempting to connect to:", "[" + MONGO_URI + "]"); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Auth DB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- USER MODEL ---
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ email: req.body.email, password: hashedPassword });
        await user.save();
        res.status(201).send('User Registered');
    } catch(err) { res.status(500).send(err.message); }
});

// LOGIN
app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Cannot find user');

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Create Token with User ID inside
            const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET);
            res.json({ accessToken: accessToken });
        } else {
            res.send('Not Allowed');
        }
    } catch(err) { res.status(500).send(err.message); }
});


app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});