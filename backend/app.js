const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Cấu hình CORS
app.use(
  cors({
    origin: '*',
  }),
);

// Middleware để xử lý JSON body
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/uploads', uploadRoutes);

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - ${req.ip}`);
  next();
});
