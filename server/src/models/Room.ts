import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
    roomId: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    createdBy: string;
    userCount: number;
    lastActivity: Date;
}

const RoomSchema = new Schema<IRoom>({
    roomId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, required: true },
    userCount: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
});

// Update timestamps on save
RoomSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

export const Room = mongoose.model<IRoom>('Room', RoomSchema); 