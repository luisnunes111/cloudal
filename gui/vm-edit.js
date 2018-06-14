const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");

module.exports = class VmEditPage {
  constructor(state) {
    this.vmID = state.id;
    this.screen = state.screen;
    this.box = undefined;
    this.init();
  }

  init() {
    this.createBox();
  }

  onSubmit(data) {
    // const optionsPage = new VmOptionsPage(this.screen, this.VMs[index].ID);
    this.box.destroy();
  }

  createBox() {
    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "50%",
      height: "50%",
      content: "VM Edit",
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

    this.box.focus();
    this.screen.render();
  }
};
