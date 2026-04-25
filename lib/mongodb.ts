import mongoose from "mongoose";

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable.");
  }
  return uri;
}


//setting up the mongoose cache and global variable to avoid multiple connections to the database
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // Allow reuse of the cached connection across hot reloads in development.
  var mongooseCache: MongooseCache | undefined;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = cached;
}






//main function to connect to the database

export async function connectToDatabase(): Promise<typeof mongoose> {
  const mongoUri = getMongoUri();

  // Return an existing live connection if we already have one.
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse an in-flight connection promise to avoid parallel connect calls.
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
