var chalk = require("chalk");
var fs = require("fs");

class LogManager {
  constructor() {}

  logStartGame(creature) {
    console.log(
      chalk.blue(`
      Welcome to Tamagotchi!

      You can interact with your creature tiping:
      f: to give him food
      t: to give him water
      c: to clean him
      h: to cure him
      
      Let's play!
    `)
    );

    let lastEvents = "";
    this.readLastEvents(creature)
      .then(result => {
        lastEvents = result;
        if (lastEvents) {
          console.log("Last events: " + lastEvents);
        } else {
          this.logStatus(creature);
        }
      })
      .catch(error => {
        if (error.code != "ENOENT") {
          this.logManager.logError("Error reading last events: " + error);
        }
      });
  }

  getColoredStat(stat) {
    if (stat < 20) {
      return chalk.red("(" + stat + "%)");
    } else if (stat < 50) {
      return chalk.yellow("(" + stat + "%)");
    } else {
      return chalk.green("(" + stat + "%)");
    }
  }

  logStatus(creature) {
    let stateInfo =
      "\n" +
      this.getDateToDisplay() +
      " - " +
      creature.name +
      ": Hungry " +
      this.getColoredStat(creature.state.hunger) +
      " | Thirsty " +
      this.getColoredStat(creature.state.thirst) +
      " | Cleanliness " +
      this.getColoredStat(creature.state.cleanliness) +
      " | Health " +
      this.getColoredStat(creature.state.health);

    console.log(stateInfo);

    this.appendLogEvent(creature, stateInfo.toString());
  }

  logCreatureDeath(creature, stat) {
    console.log(
      chalk.red(
        "\n" +
          this.getDateToDisplay() +
          " - " +
          "The game is finished, your " +
          creature.name +
          " is dead, cause: " +
          stat +
          "\n"
      )
    );
  }

  logInvalidInput(input) {
    console.log("\n" + input + ": Invalid input!");
  }

  logIncrease(action, creature) {
    let stateInfo =
      "\n" +
      this.getDateToDisplay() +
      " - Player " +
      action +
      " " +
      creature.name;

    console.log(stateInfo);
    this.logStatus(creature);
    this.appendLogEvent(creature, stateInfo);
  }

  logError(error) {
    console.log(chalk.red(error));
  }

  logCloseGame() {
    console.log(chalk.blue("\nBye! See you next time :)\n"));
  }

  logCreatureLoaded(creature) {
    console.log(
      chalk.blue("\nYour creature " + creature.name + " has been loaded :)")
    );
  }

  logNewFileSaved(creature) {
    console.log("New file saved for the creature " + creature.name + "! :)");
  }

  logDecrease(creature, stat, value) {
    let stateInfo =
      "\n" +
      this.getDateToDisplay() +
      " - " +
      creature.name +
      " has been decreased of " +
      stat +
      ": " +
      "-" +
      value;

    console.log(stateInfo);
    this.appendLogEvent(creature, stateInfo);
  }

  getDateToDisplay() {
    let date = new Date();
    return (
      date.getDate() +
      "." +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      " - " +
      date
        .getHours()
        .toString()
        .padStart(2, "0") +
      ":" +
      date
        .getMinutes()
        .toString()
        .padStart(2, "0") +
      ":" +
      date
        .getSeconds()
        .toString()
        .padEnd(2, "0")
    );
  }

  readLastEvents(creature) {
    let rowsToRead = Math.floor(Math.random() * 10) + 3;
    let fileName = "./src/log/" + creature.name.trim().toLowerCase() + ".log";

    return new Promise(function(resolve, reject) {
      fs.readFile(fileName, (err, data) => {
        if (err) {
          reject(err);
        } else if (data) {
          let dataRows = data.toString().split("\n");
          resolve(
            dataRows
              .slice(0, Math.min(rowsToRead - 1, dataRows.length))
              .join('\n')
          );
        } else {
          resolve("");
        }
      });
    });
  }

  appendLogEvent(creature, eventString) {
    let fileName = "./src/log/" + creature.name.trim().toLowerCase() + ".log";
    fs.appendFile(fileName, eventString, error => {
      if (error && error.code != "ENOENT") {
        this.logError(error);
      }
    });
  }

  deleteLogFile(creature) {
    return new Promise(function(resolve, reject) {
      fs.unlink(
        "./src/log/" + creature.name.trim().toLowerCase() + ".log",
        error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }
}

try {
  module.exports = LogManager;
} catch (e) {}
