const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");

module.exports = class VmInfoPage {
  constructor(state) {
    this.vmID = state.id;
    this.screen = state.screen;
    this.box = undefined;
    this.init();
  }

  init() {
    this.createBox();
  }

  createBox() {
    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "50%",
      height: "50%",
      content: "VM Info",
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
      history.back();
    });

    this.box.key("x", (ch, key) => {
      history.foward();
    });

    this.box.focus();
    this.screen.render();
  }
};
