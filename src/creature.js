class Creature {

  constructor(name, state) {
    if(!name){
      throw new Error('Cannot create a new creature without a name');
    }
    this.name = name;
    this.state = state || {
      hunger : 100,
      thirst : 100,
      cleanliness : 100,
      health : 100
    };
  }

  decrease(stat, value){
    if (!this.state[stat] || value == NaN || value <= 0) {
      throw new Error("Not allowed parameters passed for function decrease:  stat: " + stat + ", value: " + value);
    } else {
      this.state[stat] -= value;
    }
  }

  fill(stat){
    if(!this.state[stat]){
      throw new Error("Not allowed parameters passed for function fill:  stat: " + stat);
    } else {
      this.state[stat] = 100;
    }
  }
}

try {
  module.exports = Creature;
} catch (e) { }