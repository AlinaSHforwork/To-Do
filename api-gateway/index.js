const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());

// 1. Get Settings from Environment
const PORT = process.env.PORT;
const AUTH_URL = process.env.AUTH_SERVICE_URL;
const TODO_URL = process.env.TODO_SERVICE_URL;
console.log(`Gateway starting... Config:`);
console.log(`- Auth Service -> ${AUTH_URL}`);
console.log(`- Todo Service -> ${TODO_URL}`);

// 1. Auth Route
app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true
}));

// 2. Todo Route
app.use('/api/tasks', createProxyMiddleware({
    target: process.env.TODO_SERVICE_URL,
    changeOrigin: true
}));

app.listen(8080, () => console.log('Gateway running'));