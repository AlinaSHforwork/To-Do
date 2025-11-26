import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken'; 
import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT ;
const MONGO_URI = process.env.MONGO_URI ;
const JWT_SECRET = 'your_super_secret_key'; // Must match Auth Service key

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Todo DB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- REAL AUTH MIDDLEWARE ---
// This verifies the token created by the Auth Service
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); 

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token is invalid/expired
        req.user = user; // Attach user info (userId) to request
        next();
    });
};

let channel;
async function connectQueue() {
    try {
        const connection = await amqp.connect('amqp://guest:guest@rabbitmq:5672');
        channel = await connection.createChannel();
        await channel.assertQueue('notifications');
        console.log("✅ Connected to RabbitMQ successfully!");
    } catch (error) {
        console.log("RabbitMQ Error:", error);
        setTimeout(connectQueue, 5000);
    }
}
connectQueue();

// --- MODELS ---
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
  date: String, 
  tags: [String],
  userId: { type: String, required: true } 
});
const Task = mongoose.model('Task', taskSchema);

// --- ROUTES ---
app.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) { res.status(500).json({error: err.message}); }
});

app.post('/', authenticateToken, async (req, res) => {
  const taskData = {
    ...req.body,
    userId: req.user.userId 
  };
  const task = new Task(taskData);
  await task.save();

  // --- START NEW CODE ---
  if (channel) {
      const message = JSON.stringify({
          type: 'TASK_CREATED',
          email: 'admin@example.com', 
          taskContent: task.text
      });
      channel.sendToQueue('notifications', Buffer.from(message));
      console.log("Message sent to RabbitMQ");
  }
  // --- END NEW CODE ---

  res.status(201).json(task);
});


app.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) { res.status(500).json({error: err.message}); } 
 });

app.listen(PORT, () => {
  console.log(`Todo Service running on port ${PORT}`);
});





