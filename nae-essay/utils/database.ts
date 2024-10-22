import { MongoClient } from 'mongodb';

const url = process.env.MONGO_URL as string;
let connectDB: Promise<MongoClient>;

declare global {
    var _mongo: Promise<MongoClient> | undefined;
}

if (!url) {
    throw new Error('Please define the MONGO_URL environment variable');
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongo) {
        global._mongo = new MongoClient(url).connect();
    }
    connectDB = global._mongo;
} else {
    connectDB = new MongoClient(url).connect();
}

export { connectDB };
