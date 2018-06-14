const blessed = require("blessed");

module.exports = class ConfirmPrompt {
  constructor(screen, text, callback) {
    this.screen = screen;
    this.text = text;
    this.callback = callback;
    this.prompt = undefined;
    this.init();
  }

  init() {
    var self = this;

    this.prompt = blessed.form({
      // parent: this.screen,
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

    this.prompt.okay = blessed.button({
      parent: this.prompt,
      top: 5,
      height: 1,
      left: 2,
      width: 6,
      content: "Okay",
      align: "center",
      bg: "black",
      hoverBg: "blue",
      mouse: true,
      style: {
        bg: "lightblack",
        focus: {
          bg: "lightblue"
        }
      }
    });

    this.prompt.cancel = blessed.button({
      parent: this.prompt,
      top: 5,
      height: 1,
      shrink: true,
      left: 10,
      width: 8,
      content: "Cancel",
      align: "center",
      bg: "black",
      hoverBg: "blue",
      mouse: true,
      style: {
        bg: "lightblack",
        focus: {
          bg: "lightblue"
        }
      }
    });

    this.prompt.okay.on("press", () => {
      self.done();
      return self.callback();
    });

    this.prompt.cancel.on("press", () => {
      self.done();
    });
    this.prompt.on("keypress", (ch, key) => {
      if (key.name == "q") {
        self.done();
      }
    });
    this.screen.append(this.prompt);
    this.prompt.setContent(" " + this.text);
    this.prompt.show();
    this.screen.saveFocus();
    this.prompt.focus();
    this.screen.render();
  }

  done() {
    this.screen.restoreFocus();
    this.prompt.destroy();
    this.screen.render();

    // this.prompt.okay.removeListener("press", this.okay);
    // this.prompt.cancel.removeListener("press", this.cancel);
  }
};
