import mongoose from "mongoose";
import dns from "node:dns";

type GlobalWithMongoose = typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalWithMongoose = globalThis as GlobalWithMongoose;

const cached = globalWithMongoose.mongooseCache || {
  conn: null,
  promise: null,
};

globalWithMongoose.mongooseCache = cached;

const getMongoUri = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.MONGO_URI;
  }

  return process.env.MONGO_URI_DEV || process.env.MONGO_URI;
};

export const connectDb = async () => {
  if (cached.conn) return cached.conn;

  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error("MongoDB URI is missing. Set MONGO_URI or MONGO_URI_DEV.");
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(mongoUri).catch(async (error: any) => {
      const isSrvRefused =
        mongoUri.startsWith("mongodb+srv://") &&
        error?.code === "ECONNREFUSED" &&
        error?.syscall === "querySrv";

      if (!isSrvRefused) throw error;

      // Some local DNS resolvers reject SRV lookup from Node/c-ares.
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      return mongoose.connect(mongoUri);
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
};
