import mongoose from 'mongoose';

let conn = null;

export async function dbConnect() {
  if (conn) return conn;
  if (mongoose.connection.readyState >= 1) {
    conn = mongoose.connection;
    return conn;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');
  await mongoose.connect(uri, { dbName: 'bizbot' });
  conn = mongoose.connection;
  return conn;
}