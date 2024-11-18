// server/models/multiArmBandit.js
class MultiArmBandit {
    constructor(initial_epsilon, num_clusters, decay_rate) {
      this.initial_epsilon = initial_epsilon;
      this.epsilon = initial_epsilon;
      this.num_clusters = num_clusters;
      this.counts = Array(num_clusters).fill(0);
      this.values = Array(num_clusters).fill(2.0);
      this.decay_rate = decay_rate;
    }
  
    choose_arm() {
      if (Math.random() > this.epsilon) {
        return this.values.indexOf(Math.max(...this.values));
      } else {
        return Math.floor(Math.random() * this.num_clusters);
      }
    }
  
    update(arm, reward) {
      this.counts[arm] += 1;
      const n = this.counts[arm];
      const value = this.values[arm];
      const new_value = ((n - 1) / n) * value + (1 / n) * reward;
      this.values[arm] = new_value;
    }
  
    decay_epsilon() {
      if (this.epsilon > 0.2) {
        this.epsilon *= this.decay_rate;
      }
    }
  }
  
  module.exports = MultiArmBandit;