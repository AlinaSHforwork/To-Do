// backend/index.js (UPDATED with Auth Middleware and User-Filtering)

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MONGO_URI, PORT } from './config.js'; // Ensure config.js is properly defining these
import jwt from 'jsonwebtoken'; // You will need to install this: npm install jsonwebtoken

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Auth Middleware (MOCKING) ---
// This middleware extracts a dummy user ID.
const authenticateToken = (req, res, next) => {
    // Check for Authorization header (e.g., "Bearer dummy_auth_token_123")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Unauthorized

    // In a real application, you would verify the JWT here:
    /* jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
    */

    // MOCK LOGIN: If a token exists, assign a hardcoded user ID for testing.
    // In a real app, this ID comes from the JWT payload.
    req.user = { userId: 'user_A_123' }; // <-- IMPORTANT: ALL TASKS WILL BE FILTERED BY THIS ID
    next(); 
};


// --- Task Model (UPDATED) ---
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  date: String, // YYYY-MM-DD
  tags: [String],
  userId: { type: String, required: true } // NEW FIELD
});
const Task = mongoose.model('Task', taskSchema);

// Event model (kept the same, but should also have userId in a final app)
const eventSchema = new mongoose.Schema({
  title: String,
  date: String, // YYYY-MM-DD
  time: String,
  taskId: String
});
const Event = mongoose.model('Event', eventSchema);


// --- Task Endpoints (UPDATED with Filtering/User ID) ---

// GET /api/tasks: ONLY return tasks belonging to the logged-in user
app.get('/api/tasks', authenticateToken, async (req, res) => {
  // CRITICAL: Filter by the user ID provided by the middleware
  const tasks = await Task.find({ userId: req.user.userId });
  res.json(tasks);
});

// POST /api/tasks: Save task with the logged-in user's ID
app.post('/api/tasks', authenticateToken, async (req, res) => {
  // CRITICAL: Inject the user ID before saving
  const taskData = {
    ...req.body,
    userId: req.user.userId
  };
  const task = new Task(taskData);
  await task.save();
  res.status(201).json(task);
});

// PUT and DELETE endpoints should also use authenticateToken and filter by userId
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    // Find by ID AND userId to ensure users can only update their own tasks
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId }, 
        req.body, 
        { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found or does not belong to user." });
    res.json(task);
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.user.userId });
    if (result.deletedCount === 0) return res.status(404).json({ message: "Task not found or does not belong to user." });
    res.status(204).end();
});

// --- Event Endpoints (You should apply the same filtering here) ---
app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});
// ... other event routes ...

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});


// NOTE: Login should return a real JWT token in a final app, not 'dummy_auth_token_123'.
// ...