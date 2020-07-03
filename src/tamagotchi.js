const Creature = require("./creature.js");
const StoreManager = require("./store/store-manager.js");
const LogManager = require("./log/log-manager.js");
const readline = require("readline");

class Tamagotchi {
  constructor(puppyName) {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    this.storeManager = new StoreManager();
    this.logManager = new LogManager();

    this.initializeGame(puppyName);
  }

  /**
   * Initialize the Game loading the creature status
   */
  initializeGame(puppyName) {
    this.storeManager
      .fetchCreatureState(puppyName)
      .catch(error => {
        if (error.code != "ENOENT") {
          this.logManager.logError("Error fetching the creature: " + error);
        }
      })
      .then(fetchedState => {
        if (fetchedState) {
          this.creature = new Creature(puppyName, fetchedState);
          this.logManager.logCreatureLoaded(this.creature);
          this.startGame();
        } else {
          this.creature = new Creature(puppyName);
          this.storeManager
            .saveCreature(this.creature)
            .then(() => {
              this.logManager.logNewFileSaved(this.creature);
              this.startGame();
            })
            .catch(error => {
              this.logManager.logError("ERROR saving the creature: " + error);
            });
        }
      });
  }

  startGame() {
    this.logManager.logStartGame(this.creature);

    process.stdin.on("keypress", (data, key) => {
      this.inputListener(data, key);
    });

    this.setDecreasingInterval();
    this.setSavingInterval();
  }

  setSavingInterval() {
    this.savingInterval = setInterval(() => {
      this.storeManager.saveCreature(this.creature);
    }, Math.floor(Math.random() * 5000) + 1000);
  }

  feed() {
    this.creature.fill("hunger");
    this.logManager.logIncrease("feeds", this.creature);
  }

  clean() {
    this.creature.fill("cleanliness");
    this.logManager.logIncrease("cleans", this.creature);
  }

  water() {
    this.creature.fill("thirst");
    this.logManager.logIncrease("gives water", this.creature);
  }

  cure() {
    this.creature.fill("health");
    this.logManager.logIncrease("cure", this.creature);
  }

  inputListener(data, key) {
    const actions = {
      f: () => this.feed(),
      c: () => this.clean(),
      t: () => this.water(),
      h: () => this.cure()
    };
    if (key.ctrl && key.name === "c") {
      this.logManager.logCloseGame();
      this.stopGame();
    } else if (!actions.hasOwnProperty(data.trim()) ){
      this.logManager.logInvalidInput(data);
    } else {
      actions[data.trim()]();
    }
  }

  setDecreasingInterval() {
    this.decreasingInterval = setInterval(() => {
      this.decreaseStatus();
    }, Math.floor(Math.random() * 5000) + 1000);
  }

  stopGame() {
    clearInterval(this.decreasingInterval);
    clearInterval(this.savingInterval);
    process.stdin.removeAllListeners("data");
    process.exit(0);
  }

  decreaseStatus() {
    let gameStopped = false;
    let propkeys = Object.keys(this.creature.state);
    let statToChange = Math.floor(Math.random() * 4) + 1;
    let valueToRemove = (Math.floor(Math.random() * 5) + 1) * 5;

    this.creature.decrease(propkeys[statToChange - 1], valueToRemove);

    this.logManager.logDecrease(
      this.creature,
      propkeys[statToChange - 1],
      valueToRemove
    );

    this.logManager.logStatus(this.creature);

    Object.values(this.creature.state).forEach(stat => { 
      if (Number(stat <= 0)) {
        gameStopped = true;
        this.logManager.logCreatureDeath(
          this.creature,
          propkeys[statToChange - 1]
        );
        this.storeManager.deleteCreatureState(this.creature);
        this.logManager.deleteLogFile(this.creature);
        this.stopGame(propkeys[statToChange - 1]);
      }
    });
    clearInterval(this.decreasingInterval);
    if (!gameStopped) {
      this.setDecreasingInterval();
    }
  }
}

try {
  module.exports = Tamagotchi;
} catch (e) {}
