import request from 'supertest';
import { app } from '../server';
import mongoose from 'mongoose';
import { UserSession } from '../models/UserSession';

// Clean up the database before and after tests
beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/code-sync-test');
});

afterAll(async () => {
  // Clean up and close the connection
  await UserSession.deleteMany({});
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the users collection before each test
  await UserSession.deleteMany({});
});

describe('User Endpoints', () => {
  let testUser: any;

  beforeEach(async () => {
    // Create a test user before each test
    testUser = await UserSession.create({
      username: 'testuser',
      roomId: 'testroom',
      status: 'online',
      socketId: 'test-socket-id'
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].username).toBe('testuser');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const response = await request(app).get(`/api/users/${testUser._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('testuser');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/users/${fakeId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid id format', async () => {
      const response = await request(app).get('/api/users/invalid-id');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const response = await request(app).delete(`/api/users/${testUser._id}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify user is deleted
      const deletedUser = await UserSession.findById(testUser._id);
      expect(deletedUser).toBeNull();
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update a user', async () => {
      const updates = {
        username: 'updateduser',
        status: 'offline'
      };
      
      const response = await request(app)
        .patch(`/api/users/${testUser._id}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe('updateduser');
      expect(response.body.data.status).toBe('offline');
    });

    it('should not allow updating protected fields', async () => {
      const updates = {
        socketId: 'new-socket-id',
        createdAt: new Date()
      };
      
      const response = await request(app)
        .patch(`/api/users/${testUser._id}`)
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.data.socketId).toBe('test-socket-id');
    });
  });
}); 