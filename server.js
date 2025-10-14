import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Budget-mgt-app';

// home page route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});