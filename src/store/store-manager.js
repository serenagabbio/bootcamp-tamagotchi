var fs = require("fs");

class StoreManager {
  constructor() {}

  /**
   * Save creature state on file
   * @param {*} creature the creature to save
   */
  saveCreature(creature) {
    let creatureFileName = creature.name.trim().toLowerCase();
    return new Promise((resolve, reject) => {
      fs.writeFile(
        "./src/store/" + creatureFileName + ".json",
        JSON.stringify(creature.state),
        function(error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  /**
   * Fetch the creature state from file
   * @param {*} name the name of the creature
   */
  fetchCreatureState(name) {
    return new Promise(function(resolve, reject) {
      fs.readFile(
        "./src/store/" + name.trim().toLowerCase() + ".json",
        (error, data) => {
          if (error) {
            reject(error);
          } else if (data.length == 0) {
            reject(new Error("Empty file"));
          } else {
            try{
              resolve(JSON.parse(data));
            } catch(err){
              reject(err);
            }
          }
        }
      );
    });
  }

  /**
   * Delete the creature state file
   * @param {*} name the name of the creature
   */
  deleteCreatureState(creature) {
    return new Promise(function(resolve, reject) {
      fs.unlink("./src/store/" + creature.name.trim().toLowerCase() + ".json", error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

try {
  module.exports = StoreManager;
} catch (e) {}
