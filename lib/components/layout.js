const blessed = require("blessed");

const chalk = require("chalk");

module.exports = class Layout {
  constructor(screen) {
    this.screen = screen;
    this.init();
  }

  init() {
    this.containerBox = blessed.box({
      parent: this.screen,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      tags: true,
      border: {
        type: "line"
      },
      style: {
        fg: "white",
        bg: "blue",
        border: {
          fg: "#FFFFFF"
        }
      }
    });

    this.mainBox = blessed.box({
      parent: this.containerBox,
      top: 0,
      left: 0,
      width: "99%",
      height: "93%",
      //content: "Main Box",
      tags: true,
      style: {
        fg: "white",
        bg: "blue"
      }
    });

    this.commandBox = blessed.box({
      parent: this.containerBox,
      right: 0,
      bottom: 0,
      width: "99%",
      height: "7%",
      valign: "middle",
      align: "left",
      content: chalk.white.bold("Commands: ") +
        chalk.red.bold("  [EXIT]: ESC") +
        chalk.green.bold("  [SELECT]: Enter") +
        chalk.yellow.bold("  [BACK]: z") +
        chalk.yellow.bold("  [FORWARD]: x") +
        chalk.white.bold("  [PAGE NAVIGATION]: ▲ ▼"),
      align: "center",
      tags: true,
      style: {
        fg: "white",
        bg: "black"
      }
    });
    // this.historyBox = blessed.box({
    //   parent: this.containerBox,
    //   top: "center",
    //   left: 0,
    //   width: "10%",
    //   height: "50%",
    //   content: "History Box",
    //   tags: true,
    //   border: {
    //     type: "line"
    //   },
    //   style: {
    //     fg: "white",
    //     bg: "blue",
    //     border: {
    //       fg: "#FFFFFF"
    //     }
    //   }
    // });
  }
};