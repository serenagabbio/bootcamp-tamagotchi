const StoreManager = require("./store-manager.js");
const Creature = require("../creature.js");

describe("Store Manager", () => {
  beforeEach(() => {
    dino = new Creature("Dino", {
      hunger: 100,
      thirst: 100,
      clealiness: 100,
      health: 100
    });
    kitten = new Creature('Kitten', {});
    storeManager = new StoreManager();
  });

  it("should create a new instance", async () => {
    var newInstance =  await new StoreManager();
    expect(newInstance).toBeTruthy();
  });

  it("should create a new file without errors, if it does not exist", async () => {
    expect(() => {
      storeManager.saveCreature(kitten);
    }).not.toThrowError();
  });

  it("should throws an error if try to delete a not existing file", async () => {
    dog = await new Creature('dog', {});
    storeManager.deleteCreatureState(dog).catch((err) => {
      if(err){
        expect(err.code).toEqual('ENOENT');
      }
    });
  });

  it("should delete the file without errors if it exists", () => {
    expect(() => {
      new StoreManager().deleteCreatureState(kitten);
    }).not.toThrowError();
  });
});
