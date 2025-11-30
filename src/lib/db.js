import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

if (!uri) {
  console.error("MONGODB_URI is missing!");
  throw new Error("MONGODB_URI env variable is missing");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
}

export async function getDb() {
  try {
    if (!uri) {
      throw new Error("MONGODB_URI is not set in environment variables");
    }
    const client = await clientPromise;
    return client.db(process.env.MONGODB_DB || "pulseiq");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.error("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.error("MONGODB_URI length:", process.env.MONGODB_URI?.length || 0);
    throw error;
  }
}

