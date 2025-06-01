const reqRooms = require("supertest");
const { app } = require("../server");
import mongoose from 'mongoose';
import { Room } from '../models/Room';
import { UserSession } from '../models/UserSession';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-sync-test');
});

afterAll(async () => {
  await Room.deleteMany({});
  await UserSession.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Room.deleteMany({});
  await UserSession.deleteMany({});
});

describe('Room Endpoints', () => {
  let testRoom: any;

  beforeEach(async () => {
    // Create a test room
    testRoom = await Room.create({
      roomId: 'test-room-123',
      name: 'Test Room',
      description: 'A room for testing',
      createdBy: 'testuser',
      lastActivity: new Date()
    });

    // Create some test users in the room
    await UserSession.create([
      {
        username: 'user1',
        roomId: testRoom.roomId,
        status: 'online',
        socketId: 'socket-1'
      },
      {
        username: 'user2',
        roomId: testRoom.roomId,
        status: 'offline',
        socketId: 'socket-2'
      }
    ]);
  });

  describe('POST /api/rooms', () => {
    it('should create a new room', async () => {
      const newRoom = {
        name: 'New Test Room',
        description: 'Another test room',
        createdBy: 'testuser'
      };

      const response = await reqRooms(app)
        .post('/api/rooms')
        .send(newRoom);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newRoom.name);
      expect(response.body.data.roomId).toBeDefined();
    });
  });

  describe('GET /api/rooms', () => {
    it('should return all rooms with user counts', async () => {
      const response = await reqRooms(app).get('/api/rooms');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].userCount).toBe(2);
      expect(response.body.data[0].onlineUsers).toBe(1);
    });
  });

  describe('GET /api/rooms/:roomId', () => {
    it('should return room details with users', async () => {
      const response = await reqRooms(app).get(`/api/rooms/${testRoom.roomId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Room');
      expect(Array.isArray(response.body.data.users)).toBe(true);
      expect(response.body.data.users.length).toBe(2);
      expect(response.body.data.userCount).toBe(2);
      expect(response.body.data.onlineUsers).toBe(1);
    });

    it('should return 404 for non-existent room', async () => {
      const response = await reqRooms(app).get('/api/rooms/non-existent-room');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/rooms/:roomId', () => {
    it('should update room details', async () => {
      const updates = {
        name: 'Updated Room Name',
        description: 'Updated description'
      };

      const response = await reqRooms(app)
        .patch(`/api/rooms/${testRoom.roomId}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updates.name);
      expect(response.body.data.description).toBe(updates.description);
    });
  });

  describe('DELETE /api/rooms/:roomId', () => {
    it('should delete a room and update its users', async () => {
      const response = await reqRooms(app).delete(`/api/rooms/${testRoom.roomId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify room is deleted
      const deletedRoom = await Room.findOne({ roomId: testRoom.roomId });
      expect(deletedRoom).toBeNull();

      // Verify users are updated
      const users = await UserSession.find({ roomId: testRoom.roomId });
      expect(users.length).toBe(0);
    });
  });

  describe('GET /api/rooms/:roomId/stats', () => {
    it('should return room statistics', async () => {
      const response = await reqRooms(app).get(`/api/rooms/${testRoom.roomId}/stats`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.roomId).toBe(testRoom.roomId);
      expect(response.body.data.name).toBe('Test Room');
      expect(response.body.data.totalUsers).toBe(2);
      expect(response.body.data.onlineUsers).toBe(1);
    });
  });
}); 