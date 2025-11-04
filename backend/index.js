import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt'; // Added for password hashing
import jwt from 'jsonwebtoken'; // Added for token handling
import { MONGO_URI, PORT } from './config.js'; // Ensure config.js is properly defining these

const app = express();
app.use(cors());
app.use(express.json());

// Set up JWT secret (ideally from a .env file)
const JWT_SECRET = 'your_super_secret_key'; // CHANGE THIS IN PRODUCTION!

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 

    if (token === 'dummy_auth_token_123') {
        req.user = { userId: 'user_A_123' }; 
        return next();
    }
    return res.sendStatus(401); 
};


// --- Models ---

// Task model (UPDATED: Added userId field)
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  date: String, // YYYY-MM-DD
  tags: [String],
  userId: { type: String, required: true } // New: Required to filter tasks
});
const Task = mongoose.model('Task', taskSchema);

// Event model (Simplified: Does not yet use userId)
const eventSchema = new mongoose.Schema({
  title: String,
  date: String, // YYYY-MM-DD
  time: String,
  taskId: String
});
const Event = mongoose.model('Event', eventSchema);

// User model (Password will now store a bcrypt hash)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } 
});
const User = mongoose.model('User', userSchema);


// --- Task Endpoints (Protected & Filtered) ---

// GET /api/tasks: ONLY return tasks belonging to the logged-in user
app.get('/api/tasks', authenticateToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
});

// POST /api/tasks: Save task with the logged-in user's ID
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const taskData = {
    ...req.body,
    userId: req.user.userId // Inject the user ID from the middleware
  };
  const task = new Task(taskData);
  await task.save();
  res.status(201).json(task);
});

// PUT /api/tasks/:id: Update task only if it belongs to the user
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId }, 
        req.body, 
        { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found or does not belong to user." });
    res.json(task);
});

// DELETE /api/tasks/:id: Delete task only if it belongs to the user
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Task not found or does not belong to user." });
    res.status(204).end();
});


// --- Event Endpoints (Unprotected - Placeholder) ---
app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/api/events', async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.status(201).json(event);
});

app.put('/api/events/:id', async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
});

app.delete('/api/events/:id', async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(204).end();
});


// --- Authentication Endpoints (Updated with bcrypt) ---

// POST /api/register (Sign-up)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 2. SAVE THE HASHED PASSWORD
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    // 3. MOCK TOKEN GENERATION (Should be a real JWT)
    res.status(201).json({ message: 'User registered successfully', token: 'dummy_auth_token_123' });
    
  } catch (err) {
    if (err.code === 11000) { // MongoDB duplicate key error (Email already exists)
      return res.status(409).json({ message: 'Email already registered.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.json({ message: 'Login successful', token: 'dummy_auth_token_123' });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});