import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createServer } from '../src/server.ts';
import { updateUser } from '../src/store/store.ts';

describe('CRUD API Tests', () => {
  const server = createServer();

  beforeEach(async () => {
    await updateUser([]);
  });

  describe('Scenario 1: Get all users from empty store', () => {
    it('should return empty array when no users exist', async () => {
      await request(server)
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body).toEqual([]);
        });
    });
  });

  describe('Scenario 2: Complete user creation and retrieval', () => {
    const testUser = {
      username: 'Dima',
      age: 33,
      hobbies: ['sport'],
    };

    it('should create user and then retrieve it by ID', async () => {
      const newUser = (
        await request(server)
          .post('/api/users')
          .send(testUser)
          .set('Accept', 'application/json')
          .expect(201)
          .expect('Content-Type', /json/)
      ).body;

      const getUser = (
        await request(server)
          .get(`/api/users/${newUser.id}`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type', /json/)
      ).body;
      expect(newUser).toEqual(getUser);
    });

    it('should return 400 when creating user with missing fields', async () => {
      const invalidUser = {
        username: 'Dima',
      };

      await request(server)
        .post('/api/users')
        .send(invalidUser)
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
          expect(response.body).toBe('username, age and hobbies are required');
        });
    });
  });

  describe('Scenario 3: User update and deletion lifecycle', () => {
    let userId: string;
    const user = {
      username: 'Dima',
      age: 25,
      hobbies: ['sport'],
    };

    const updatedUser = {
      age: 33,
    };

    beforeEach(async () => {
      userId = (
        await request(server).post('/api/users').send(user).set('Accept', 'application/json')
      ).body.id;
    });

    it('should update user and verify changes', async () => {
      await request(server)
        .put(`/api/users/${userId}`)
        .send(updatedUser)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((response) => {
          expect(response.body.id).toBe(userId);
          expect(response.body.age).toBe(updatedUser.age);
        });
    });

    it('should delete user and verify deletion', async () => {
      await request(server)
        .delete(`/api/users/${userId}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toBe('User deleted successfully');
        });

      await request(server)
        .get(`/api/users/${userId}`)
        .expect(404)
        .then((response) => {
          expect(response.body).toBe('User not found');
        });
    });

    it('should return 400 when trying to update with invalid user ID', async () => {
      await request(server)
        .put('/api/users/invalid-uuid')
        .send(updatedUser)
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
          expect(response.body).toBe('Invalid userID');
        });
    });
  });
});
