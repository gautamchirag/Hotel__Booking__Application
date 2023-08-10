import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/auth.js';
import usersRoute from './routes/users.js';
import hotelsRoute from './routes/hotels.js';
import roomsRoute from './routes/rooms.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
// Set strictQuery to false to avoid Mongoose deprecation warning for using "$regex" operator in queries.
mongoose.set('strictQuery', false);

// Function to connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB.');
  } catch (error) {
    throw error;
  }
};

// Handle MongoDB disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected!');
});

// Middlewares
app.use(express.static('public'));

app.use(logger);
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Route Handlers
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/rooms', roomsRoute);

// Render the index.html file for the root route ("/")
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'server' + '/public' });
});

// Error Handling Middlewares
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// Custom error handler middleware

app.use(errorHandler);
// Start the server and connect to MongoDB
app.listen(PORT, () => {
  connect();
  console.log('Connected to the backend. Listening on port 5000.');
});
