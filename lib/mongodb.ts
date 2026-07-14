import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  // Return healthy cached connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Reset stale connection/promise
  if (cached.conn || (cached.promise && mongoose.connection.readyState !== 2)) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined. Add it to .env.local');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Connection pool — reuse across serverless invocations
      maxPoolSize: 10,
      minPoolSize: 1,
      // Prevent hanging forever on DNS/network issues
      serverSelectionTimeoutMS: 10_000,
      // Socket-level timeout (Atlas idles after ~30 s on free tier)
      socketTimeoutMS: 45_000,
      connectTimeoutMS: 10_000,
      // Heartbeat keeps idle connections alive
      heartbeatFrequencyMS: 10_000,
      // Disable Mongoose command buffering — fail fast instead of hanging
      bufferCommands: false,
      // Force IPv4 to avoid DNS SRV resolution issues in some environments
      family: 4,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    // Surface a clearer error message for ETIMEOUT / ENOTFOUND
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('ETIMEOUT') || message.includes('querySrv')) {
      throw new Error(
        `MongoDB connection timeout. Check your network, Atlas IP whitelist (0.0.0.0/0), and MONGODB_URI. Original: ${message}`,
      );
    }
    throw err;
  }

  return cached.conn;
}

export default connectDB;
