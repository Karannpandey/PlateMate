// __tests__/server.test.js
const request = require('supertest');
const app = require('../server');

describe('Server API', () => {
  beforeEach(async () => {
    // Ensure a clean state between tests
    jest.clearAllMocks();
  });

  test('POST /api/initialize creates new bandits for user', async () => {
    const response = await request(app)
      .post('/api/initialize')
      .send({ userId: 'test123', goal: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Initialized successfully');
  });

  test('POST /api/getMealPlan returns valid meal plan', async () => {
    // First initialize the bandits
    await request(app)
      .post('/api/initialize')
      .send({ userId: 'test123', goal: 1 });

    const response = await request(app)
      .post('/api/getMealPlan')
      .send({ userId: 'test123', goal: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('breakfast');
    expect(response.body).toHaveProperty('lunch');
    expect(response.body).toHaveProperty('dinner');
    expect(response.body.breakfast).toHaveProperty('recipe');
    expect(response.body.breakfast).toHaveProperty('cluster');
  });

  test('POST /api/updateRatings updates bandit values', async () => {
    // First initialize the bandits
    await request(app)
      .post('/api/initialize')
      .send({ userId: 'test123', goal: 1 });

    const response = await request(app)
      .post('/api/updateRatings')
      .send({
        userId: 'test123',
        ratings: {
          breakfast: { cluster: 0, rating: 4 },
          lunch: { cluster: 1, rating: 5 },
          dinner: { cluster: 0, rating: 3 }
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Ratings updated successfully');
  });

  test('getMealPlan returns different recipes for same cluster', async () => {
    await request(app)
      .post('/api/initialize')
      .send({ userId: 'test123', goal: 1 });

    const response1 = await request(app)
      .post('/api/getMealPlan')
      .send({ userId: 'test123', goal: 1 });

    const response2 = await request(app)
      .post('/api/getMealPlan')
      .send({ userId: 'test123', goal: 1 });

    // Store results to check if at least one meal is different
    const meals1 = [response1.body.breakfast.recipe, response1.body.lunch.recipe, response1.body.dinner.recipe];
    const meals2 = [response2.body.breakfast.recipe, response2.body.lunch.recipe, response2.body.dinner.recipe];

    expect(meals1).not.toEqual(meals2);
  });
});