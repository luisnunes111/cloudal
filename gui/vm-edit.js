const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");

module.exports = class VmEditPage {
  constructor(screen, index) {
    this.vmID = index;
    this.screen = screen;
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

    // Append our box to the screen.
    this.screen.append(this.box);
    this.screen.render();
  }
};
