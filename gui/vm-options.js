const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");
const chalk = require('chalk');

const VmCreatePage = require("./vm-create.js");
const VmInfoPage = require("./vm-info.js");
const VmEditPage = require("./vm-edit.js");
const VmsListPage = require("./vms-list.js");

const ConfirmPrompt = require("../lib/components/confirm-prompt.js");

module.exports = class VmOptionsPage {
  constructor(state) {
    this.vmID = state.id;
    this.screen = state.screen;
    this.options = ["Create VM", "View info", "Edit", "Delete"];
    this.box = undefined;
    this.list = undefined;
    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    this.createList();
  }

  optionsNavigation(index) {
    var self = this;
    switch (index) {
      case 0:
        history.redirect(VmCreatePage, {
          screen: this.screen
        }, this.done);
        break;
      case 1:
        history.redirect(
          VmInfoPage, {
            screen: this.screen,
            id: this.vmID
          },
          this.done
        );
        break;
      case 2:
        history.redirect(
          VmEditPage, {
            screen: this.screen,
            id: this.vmID
          },
          this.done
        );

        break;
      case 3:
        new ConfirmPrompt(
          this.screen,
          "Are you sure that you want to delete the VM?",
          async () => {
            await client.deleteVM(this.vmID);
            history.redirect(
              VmsListPage, {
                screen: this.screen,
                redirectPage: this.constructor
              },
              this.done
            );
          }
        );
        break;
    }
  }

  createList() {
    const self = this;
    this.list = blessed.list({
      parent: this.box,
      align: "center",
      width: "90%",
      height: "90%",
      top: "center",
      left: "center",
      keys: true,
      mouse: true,
      selectedBg: "cyan",
      fg: "white",
      bg: "black"

    });
    this.list.setItems(this.options);

    this.list.on("select", function (data) {
      const index = self.list.selected;
      self.optionsNavigation(index);
    });

    this.list.key("z", (ch, key) => {
      history.back(self.done);
    });

    this.list.key("x", (ch, key) => {
      history.foward(self.done);
    });

    this.screen.render();
    this.list.focus();
  }

  createBox() {
    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "95%",
      height: "90%",
      content: chalk.white.bgCyanBright.bold("VM " + this.vmID + " Options:"),
      tags: true,

      style: {
        fg: "white",
        bg: "blue",

      }
    });

    this.screen.render();
  }

  done() {
    this.box.destroy();
    this.list.destroy();
    this.screen.render();
  }
};