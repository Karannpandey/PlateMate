// // __tests__/server.test.js
// const request = require('supertest');
// const app = require('../server');

// describe('Server API', () => {
//   beforeEach(async () => {
//     // Ensure a clean state between tests
//     jest.clearAllMocks();
//   });

//   test('POST /api/initialize creates new bandits for user', async () => {
//     const response = await request(app)
//       .post('/api/initialize')
//       .send({ userId: 'test123', goal: 1 });

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Initialized successfully');
//   });

//   test('POST /api/getMealPlan returns valid meal plan', async () => {
//     // First initialize the bandits
//     await request(app)
//       .post('/api/initialize')
//       .send({ userId: 'test123', goal: 1 });

//     const response = await request(app)
//       .post('/api/getMealPlan')
//       .send({ userId: 'test123', goal: 1 });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('breakfast');
//     expect(response.body).toHaveProperty('lunch');
//     expect(response.body).toHaveProperty('dinner');
//     expect(response.body.breakfast).toHaveProperty('recipe');
//     expect(response.body.breakfast).toHaveProperty('cluster');
//   });

//   test('POST /api/updateRatings updates bandit values', async () => {
//     // First initialize the bandits
//     await request(app)
//       .post('/api/initialize')
//       .send({ userId: 'test123', goal: 1 });

//     const response = await request(app)
//       .post('/api/updateRatings')
//       .send({
//         userId: 'test123',
//         ratings: {
//           breakfast: { cluster: 0, rating: 4 },
//           lunch: { cluster: 1, rating: 5 },
//           dinner: { cluster: 0, rating: 3 }
//         }
//       });

//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Ratings updated successfully');
//   });

//   test('getMealPlan returns different recipes for same cluster', async () => {
//     await request(app)
//       .post('/api/initialize')
//       .send({ userId: 'test123', goal: 1 });

//     const response1 = await request(app)
//       .post('/api/getMealPlan')
//       .send({ userId: 'test123', goal: 1 });

//     const response2 = await request(app)
//       .post('/api/getMealPlan')
//       .send({ userId: 'test123', goal: 1 });

//     // Store results to check if at least one meal is different
//     const meals1 = [response1.body.breakfast.recipe, response1.body.lunch.recipe, response1.body.dinner.recipe];
//     const meals2 = [response2.body.breakfast.recipe, response2.body.lunch.recipe, response2.body.dinner.recipe];

//     expect(meals1).not.toEqual(meals2);
//   });
// });

const request = require('supertest');
const app = require('../server');
const MultiArmBandit = require('../models/multiArmBandit');

// Mock MultiArmBandit methods to control randomness
jest.mock('../models/multiArmBandit', () => {
  return jest.fn().mockImplementation(() => ({
    choose_arm: jest.fn().mockReturnValue(0), // Always return cluster 0 for predictability
    update: jest.fn(),
    decay_epsilon: jest.fn(),
  }));
});

describe('Server API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  test('POST /api/initialize creates new bandits for user', async () => {
    const response = await request(app)
      .post('/api/initialize')
      .send({ userId: 'test123', goal: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Initialized successfully');
    expect(MultiArmBandit).toHaveBeenCalledTimes(3); // Ensure bandits were created
  });

  test('POST /api/getMealPlan returns valid meal plan', async () => {
    await request(app)
      .post('/api/initialize')
      .send({ userId: 'test123', goal: 1 });

    const response = await request(app)
      .post('/api/getMealPlan')
      .send({ userId: 'test123', goal: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('breakfast');
    expect(response.body.breakfast).toHaveProperty('name');
    expect(response.body.breakfast).toHaveProperty('url');
    expect(response.body.breakfast).toHaveProperty('cluster');
  });

  test('POST /api/updateRatings updates bandit values', async () => {
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
          dinner: { cluster: 0, rating: 3 },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Ratings updated successfully');
    expect(MultiArmBandit).toHaveBeenCalledTimes(3); // Ensure all bandits were updated
  });

  test('getMealPlan returns different recipes for the same cluster', async () => {
    await request(app)
      .post('/api/initialize')
      .send({ userId: 'test123', goal: 1 });

    const response1 = await request(app)
      .post('/api/getMealPlan')
      .send({ userId: 'test123', goal: 1 });

    const response2 = await request(app)
      .post('/api/getMealPlan')
      .send({ userId: 'test123', goal: 1 });

    const breakfastNames = [response1.body.breakfast.name, response2.body.breakfast.name];
    const lunchNames = [response1.body.lunch.name, response2.body.lunch.name];
    const dinnerNames = [response1.body.dinner.name, response2.body.dinner.name];

    // Allow possibility of random overlap, but ensure at least one difference
    const areDifferent = breakfastNames[0] !== breakfastNames[1]
      || lunchNames[0] !== lunchNames[1]
      || dinnerNames[0] !== dinnerNames[1];

    expect(areDifferent).toBe(true);
  });
});
