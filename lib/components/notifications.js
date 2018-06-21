const blessed = require("blessed");

exports.success = function successNotification(screen, text, callback) {
  const color = "green";
  new TerminalNotification(screen, text, color, callback);
};

exports.warning = function warningNotification(screen, text, callback) {
  const color = "cyan";
  new TerminalNotification(screen, text, color, callback);
};

exports.error = function errorNotification(screen, text, callback) {
  const color = "red";
  new TerminalNotification(screen, text, color, callback);
};

class TerminalNotification {
  constructor(screen, text, color, callback) {
    this.screen = screen;
    this.text = text;
    this.color = color;
    this.callback = callback;
    this.prompt = undefined;
    this.init();
  }

  init() {
    var self = this;

    this.prompt = blessed.box({
      parent: this.screen,
      hidden: true,
      content: "",
      width: "100%",
      height: 3,
      left: 0,
      top: 0,
      valign: "middle",
      tags: true,
      style: {
        fg: "white",
        bg: this.color,
        bold: true
      },
      padding: {
        left: 5
      }
    });

    // this.prompt.on("keypress", (ch, key) => {
    //   if (key.name == "q") {
    //     self.done();
    //   }
    // });

    this.prompt.setContent(this.text);
    this.prompt.show();
    this.screen.render();

    setTimeout(() => {
      self.done();
    }, 1700);
  }

  done() {
    this.prompt.destroy();
    this.screen.render();
    this.callback && this.callback();
  }
}
