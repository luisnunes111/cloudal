const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");

module.exports = class VmDashboardPage {
  constructor(state) {
    this.vmID = state.id;
    this.screen = state.screen;
    this.box = undefined;
    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
  }

  createBox() {
    const self = this;

    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "50%",
      height: "50%",
      content: "Dashboard",
      tags: true,
      border: {
        type: "line"
      },
      style: {
        fg: "white",
        bg: "magenta",
        border: {
          fg: "#f0f0f0"
        }
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
