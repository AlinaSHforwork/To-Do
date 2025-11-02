import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MONGO_URI, PORT } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Task model
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  date: String, // YYYY-MM-DD
  tags: [String]
});
const Task = mongoose.model('Task', taskSchema);

// Event model
const eventSchema = new mongoose.Schema({
  title: String,
  date: String, // YYYY-MM-DD
  time: String,
  taskId: String
});
const Event = mongoose.model('Event', eventSchema);

// --- Task Endpoints ---
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// --- Event Endpoints ---
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

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});



// User model (Required for Sign-up/Login)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // NOTE: Use bcrypt for production!
});
const User = mongoose.model('User', userSchema);

// --- Authentication Endpoints ---

// POST /api/register (Sign-up)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    
    // For simplicity, we just return a success message and token (in a real app)
    // Here we return a dummy token. You should implement JWT creation here.
    res.status(201).json({ message: 'User registered successfully', token: 'dummy_auth_token_123' });
    
  } catch (err) {
    if (err.code === 11000) { // MongoDB duplicate key error (Email already exists)
      return res.status(409).json({ message: 'Email already registered.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // NOTE: You would find the user and compare the HASHED password here.
  // For now, we mock success if we find a user with this email.
  const user = await User.findOne({ email });

  if (user && user.password === password) { // Simple check, REPLACE with password HASHING!
    res.json({ message: 'Login successful', token: 'dummy_auth_token_123' });
  } else {
    res.status(401).json({ message: 'Invalid credentials.' });
  }
});