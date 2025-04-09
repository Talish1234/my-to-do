import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

// Define a global type-safe cache interface
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use global object for caching in dev mode
declare global {
  // Allow global `mongoose` to persist across hot reloads
  let mongooseCache: MongooseCache;
}

// Initialize cache if not already
const globalCache: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

globalThis.mongooseCache = globalCache;

async function dbConnect(): Promise<Mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI || "", {
      bufferCommands: false,
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export default dbConnect;
