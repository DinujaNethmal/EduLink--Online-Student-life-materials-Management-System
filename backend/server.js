const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const http = require('http');
const { Server } = require('socket.io');

// Route files
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const findingGroupsRoutes = require('./routes/findingGroupsRoutes');

// Chat routes
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');

//quiz files
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Body parser
app.use(express.json({ limit: '50mb' }));

// Enable CORS allowing React Frontend to communicate
app.use(cors());

// Mount routers
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/finding-groups', findingGroupsRoutes);
app.use('/api/chat', chatRoutes);

//quiz routes
app.use('/api/quiz', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/result', resultRoutes);

// Basic Default Route
app.get('/', (req, res) => {
  res.send('EduLink API is successfully running on Express!');
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    const { sender, receiver, text } = data;
    const newMessage = new Message({ sender, receiver, text });
    await newMessage.save();

    io.to(receiver).emit('receiveMessage', data);
    io.to(sender).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
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
  server.listen(PORT, console.log(`Server running in development mode on port ${PORT}`));
});
