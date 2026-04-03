const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Route files
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const findingGroupsRoutes = require('./routes/findingGroupsRoutes');

//quiz files
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));

// Enable CORS allowing React Frontend to communicate
app.use(cors());

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/finding-groups', findingGroupsRoutes);

//quiz routes
app.use('/api/quiz', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/result', resultRoutes);

// Basic Default Route
app.get('/', (req, res) => {
  res.send('EduLink API is successfully running on Express!');
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Error: ${err.message}`);
    console.warn(`⚠️ The Express API has successfully booted, but MongoDB Atlas is offline. Expect database calls to fail gracefully.`);
  }
};

const PORT = process.env.PORT || 5000;

// Connect DB and Start Server
connectDB().then(() => {
  app.listen(PORT, console.log(`Server running in development mode on port ${PORT}`));
});
