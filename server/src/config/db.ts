import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-sync');
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export const disconnectDB = async () => {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.connection.close();
        isConnected = false;
        console.log('MongoDB disconnected successfully');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
    isConnected = false;
});

// Handle process termination
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
}); 