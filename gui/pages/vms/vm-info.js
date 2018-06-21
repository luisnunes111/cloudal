const blessed = require("blessed");
const client = require("../../../api/open-nebula/opennebula.js");
const history = require("../../../lib/configs/history.js");
const chalk = require('chalk');
const TerminalNotification = require("../../../lib/components/notifications.js");

module.exports = class VmInfoPage {
  constructor(state) {
    this.vmID = state.id;
    this.screen = state.screen;
    this.box = undefined;
    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    TerminalNotification.success(this.screen, "Exemplo de uma notificação!");
  }

  createBox() {
    const self = this;

    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      right: 10,
      width: "80%",
      height: "75%",
      content: chalk.white.bgCyanBright.bold("Info:"),
      tags: true,
      style: {
        fg: "white",
        bg: "cyan",

      }
    });

    this.box.key("z", (ch, key) => {
      history.back(self.done);
    });

    this.box.key("x", (ch, key) => {
      history.foward(self.done);
    });

    this.box.focus();
    this.screen.render();
  }

  done() {
    this.box.destroy();
    this.screen.render();
  }
};