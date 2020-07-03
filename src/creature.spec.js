const Creature = require("./creature.js");

describe("Creature", () => {
  it("should create new instance", () => {
    expect(new Creature("Dino")).toBeTruthy();
  });

  it("should throws an error if the name is not specified", () => {
    expect(() => {
      new Creature();
    }).toThrow(new Error("Cannot create a new creature without a name"));
  });

  it("should create new instance with specified name", () => {
    expect(new Creature("Dino").name).toBe("Dino");
  });

  it("should create new instance with all state at maximum", () => {
    expect(new Creature("Dino").state).toEqual({
      hunger: 100,
      thirst: 100,
      cleanliness: 100,
      health: 100
    });
  });
});
