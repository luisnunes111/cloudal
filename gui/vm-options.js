const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");

const VmCreatePage = require("./vm-create.js");
const VmInfoPage = require("./vm-info.js");
const VmEditPage = require("./vm-edit.js");
const VmsListPage = require("./vms-list.js");
const VmOptionsPage = require("./vm-options.js");

const ConfirmPrompt = require("../lib/components/confirm-promp.js");

module.exports = class VmOptionsPage {
  constructor(screen, index) {
    this.vmID = index;
    this.options = ["Create VM", "View info", "Edit", "Delete"];
    this.screen = screen;
    this.box = undefined;
    this.list = undefined;
    this.init();
  }

  init() {
    this.createBox();
    this.createList();
  }

  optionsNavigation(index) {
    switch (index) {
      case 0:
        new VmCreatePage(this.screen);
        this.done();
        break;
      case 1:
        new VmInfoPage(this.screen, this.vmID);
        this.done();
        break;
      case 2:
        new VmEditPage(this.screen, this.vmID);
        this.done();
        break;
      case 3:
        new ConfirmPrompt(
          this.screen,
          "Are you sure that you want to delete the VM?",
          async () => {
            await client.deleteVM(this.vmID);
            new VmsListPage(this.screen, VmOptionsPage);
            this.done();
          }
        );
        break;
    }
  }
  done() {
    this.box.destroy();
    this.list.destroy();
  }
  createList() {
    const t = this;
    this.list = blessed.list({
      align: "center",
      width: "50%",
      height: "50%",
      top: "center",
      left: "center",
      keys: true,
      mouse: true,
      selectedBg: "green",
      fg: "blue",
      border: {
        type: "line"
      }
    });
    this.list.setItems(this.options);

    this.list.on("select", function(data) {
      const index = t.list.selected;
      t.optionsNavigation(index);
    });

    this.box.append(this.list);
    this.screen.render();

    this.list.focus();
  }

  createBox() {
    this.box = blessed.box({
      top: "center",
      left: "center",
      width: "50%",
      height: "50%",
      content: "VM " + this.vmID + " Options:",
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
