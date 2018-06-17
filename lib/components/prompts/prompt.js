const blessed = require("blessed");

module.exports = class Prompt {
  constructor(screen, text) {
    this.screen = screen;
    this.text = text;
    this.prompt = undefined;

    this.createPrompt();
  }

  createPrompt() {
    this.prompt = blessed.form({
      parent: this.screen,
      hidden: true,
      content: "",
      width: "half",
      height: 7,
      left: "center",
      top: "center",
      border: {
        type: "ascii"
      },
      tags: true,
      keys: true,
      style: {
        fg: "blue",
        bg: "black",
        bold: true,
        border: {
          fg: "blue",
          bg: "red"
        }
      }
    });
    this.prompt.setContent(" " + this.text);
  }
};
