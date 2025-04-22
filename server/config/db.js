const mongoose = require('mongoose');
const dbPath = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// insertPostDate(); Comment this out after saving adn running the first time so you can check for inserted data

module.exports = connectDB;
