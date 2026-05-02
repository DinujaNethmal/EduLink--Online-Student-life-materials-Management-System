const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Product = require('./models/Product');
const MemberPost = require('./models/MemberPost');
const Quiz = require('./models/Quiz');

async function checkConnection() {
  try {
    console.log('--- MongoDB Diagnostic ---');
    console.log('Connecting to:', process.env.MONGO_URI);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connection Status: CONNECTED');
    
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const postCount = await MemberPost.countDocuments();
    const quizCount = await Quiz.countDocuments();
    
    console.log('\n--- Live Data Summary ---');
    console.log(`Users: ${userCount}`);
    console.log(`Products: ${productCount}`);
    console.log(`Member Posts: ${postCount}`);
    console.log(`Quizzes: ${quizCount}`);
    
    if (userCount > 0) {
      console.log('\n✅ Database is HEALTHY and contains data.');
    } else {
      console.log('\n⚠️ Database is connected but EMPTY. Please run seeding.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection Status: FAILED');
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkConnection();
