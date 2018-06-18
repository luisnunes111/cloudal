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
        type: "line"
      },
      tags: true,
      keys: true,
      style: {
        fg: "white",
        bg: "cyan",
        bold: true,
        border: {
          fg: "white"
        }
      }
    });
    this.prompt.setContent(" " + this.text);
  }
};
