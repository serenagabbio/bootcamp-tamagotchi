const LogManager = require("./log-manager.js");
const Creature = require("../creature.js");

describe("Log Manager", () => {
  beforeEach(() => {
    kitten = new Creature('Kitten', {});
  });

  it("should create a new instance", () => {
    expect(new LogManager()).toBeTruthy();
  });

  it("should return the date of today in the requested format", () => {
    let date = new Date();
    expect(new LogManager().getDateToDisplay()).toContain(
      date.getDate() + "." + (date.getMonth() + 1).toString().padStart(2, "0")
    );
  });

  it("should create a new log file without errors, if it does not exist", () => {
    expect(() => {
      new LogManager().appendLogEvent(kitten);
    }).not.toThrowError();
  });

  it("should throws an not existing file error if try to delete an not existing file", () => {
    try {
      new LogManager().deleteLogFile(kitten);
    } catch (error) {
      expect(error.type).toEqual(ENOENT);
    }
  });

});
