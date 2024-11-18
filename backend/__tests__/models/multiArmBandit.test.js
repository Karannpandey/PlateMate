// __tests__/multiArmBandit.test.js
const MultiArmBandit = require('../../models/multiArmBandit');

describe('MultiArmBandit', () => {
  let bandit;

  beforeEach(() => {
    bandit = new MultiArmBandit(1.0, 3, 0.99);
  });

  test('initializes with correct values', () => {
    expect(bandit.epsilon).toBe(1.0);
    expect(bandit.num_clusters).toBe(3);
    expect(bandit.counts).toEqual([0, 0, 0]);
    expect(bandit.values).toEqual([2.0, 2.0, 2.0]);
    expect(bandit.decay_rate).toBe(0.99);
  });

  test('choose_arm returns valid cluster index', () => {
    const arm = bandit.choose_arm();
    expect(arm).toBeGreaterThanOrEqual(0);
    expect(arm).toBeLessThan(bandit.num_clusters);
  });

  test('update method updates counts and values correctly', () => {
    bandit.update(0, 5.0);
    expect(bandit.counts[0]).toBe(1);
    expect(bandit.values[0]).toBe(5.0);

    bandit.update(0, 3.0);
    expect(bandit.counts[0]).toBe(2);
    expect(bandit.values[0]).toBe(4.0); // Average of 5.0 and 3.0
  });

  test('decay_epsilon reduces epsilon correctly', () => {
    const initial_epsilon = bandit.epsilon;
    bandit.decay_epsilon();
    expect(bandit.epsilon).toBe(initial_epsilon * bandit.decay_rate);
  });

  test('epsilon does not decay below 0.2', () => {
    bandit.epsilon = 0.19;
    bandit.decay_epsilon();
    expect(bandit.epsilon).toBe(0.19);
  });
});