import mongoose from 'mongoose';

let isConnected = false;

export async function dbConnect() {
  if (isConnected) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    await mongoose.connect(uri, {
      dbName: 'bizbot',
      bufferCommands: false,
    });

    isConnected = true;
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Alias for backward compatibility
export const getDb = dbConnect;