import mongoose, { Schema, Document } from 'mongoose';
import { USER_CONNECTION_STATUS } from '../types/user';

export interface IUserSession extends Document {
    username: string;
    roomId: string;
    status: USER_CONNECTION_STATUS;
    cursorPosition: number;
    typing: boolean;
    currentFile: string | null;
    socketId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSessionSchema = new Schema<IUserSession>(
    {
        username: { type: String, required: true },
        roomId: { type: String, required: true },
        status: { 
            type: String, 
            enum: Object.values(USER_CONNECTION_STATUS),
            default: USER_CONNECTION_STATUS.ONLINE 
        },
        cursorPosition: { type: Number, default: 0 },
        typing: { type: Boolean, default: false },
        currentFile: { type: String, default: null },
        socketId: { type: String, required: true, unique: true }
    },
    { 
        timestamps: true,
        collection: 'activeUsers'
    }
);

// Create indexes for better query performance
UserSessionSchema.index({ roomId: 1 });
UserSessionSchema.index({ socketId: 1 }, { unique: true });
UserSessionSchema.index({ username: 1, roomId: 1 });

export const UserSession = mongoose.model<IUserSession>('UserSession', UserSessionSchema); 