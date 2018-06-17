const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");

const ConfirmPrompt = require("../lib/components/prompts/confirm-prompt.js");
const VmOptionsPrompt = require("../lib/components/prompts/vm-options-prompt.js");
const TerminalNotification = require("../lib/components/notifications.js");

module.exports = class VmOptionsPage {
  constructor(state) {
    this.vmID = parseInt(state.id);
    this.screen = state.screen;
    this.options = [
      "View info",
      "Dashboard",
      "Start",
      "Reboot",
      "Shutdown",
      "Delete"
    ];
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
    switch (index) {
      case 0:
        history.redirect(
          require("./index.js").VmInfoPage,
          { screen: this.screen, id: this.vmID },
          this.done
        );
        break;
      case 1:
        history.redirect(
          require("./index.js").VmDashboardPage,
          { screen: this.screen, id: this.vmID },
          this.done
        );
        break;
      case 2:
        new ConfirmPrompt(
          this.screen,
          "Are you sure that you want to START the VM?",
          this.startVM.bind(this)
        );
        break;
      case 3:
        new VmOptionsPrompt(
          this.screen,
          "Are you sure that you want to REBOOT the VM?",
          this.rebootVM.bind(this),
          this.rebootVM.bind(this)
        );
        break;
      case 4:
        new VmOptionsPrompt(
          this.screen,
          "Are you sure that you want to SHUTDOWN the VM?",
          this.shutdownVM.bind(this),
          this.shutdownVM.bind(this)
        );
        break;
      case 5:
        new ConfirmPrompt(
          this.screen,
          "Are you sure that you want to DELETE the VM?",
          this.deleteVM.bind(this)
        );
        break;
    }
  }

  async startVM() {
    const res = await client.startVM(this.vmID);
    if (res instanceof Error) {
      TerminalNotification.error(this.screen, res.message);
    } else {
      history.redirect(
        require("./index.js").VmsListPage,
        { screen: this.screen },
        this.done,
        false
      );
      TerminalNotification.success(this.screen, "VM started successfully");
    }
  }

  async rebootVM(force) {
    const res = await client.rebootVM(this.vmID, force);
    if (res instanceof Error) {
      TerminalNotification.error(this.screen, res.message);
    } else {
      history.redirect(
        require("./index.js").VmsListPage,
        { screen: this.screen },
        this.done,
        false
      );
      TerminalNotification.success(this.screen, "VM rebooted successfully");
    }
  }

  async shutdownVM(force) {
    const res = await client.shutdownVM(this.vmID, force);
    if (res instanceof Error) {
      TerminalNotification.error(this.screen, res.message);
    } else {
      history.redirect(
        require("./index.js").VmsListPage,
        { screen: this.screen },
        this.done,
        false
      );
      TerminalNotification.success(this.screen, "VM shutted down successfully");
    }
  }

  async deleteVM() {
    const res = await client.deleteVM(this.vmID);
    if (res instanceof Error) {
      TerminalNotification.error(this.screen, res.message);
    } else {
      history.redirect(
        require("./index.js").VmsListPage,
        { screen: this.screen },
        this.done,
        false
      );
    }
  }

  createList() {
    const self = this;
    this.list = blessed.list({
      parent: this.box,
      align: "center",
      width: "50%",
      height: "50%",
      top: "center",
      left: "center",
      keys: true,
      mouse: true,
      selectedBg: "green",
      fg: "blue",
      bg: "red",
      border: {
        type: "line"
      }
    });
    this.list.setItems(this.options);

    this.list.on("select", function(data) {
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
      width: "50%",
      height: "50%",
      content: "VM " + this.vmID + " Options:",
      tags: true,
      border: {
        type: "line"
      },
      style: {
        fg: "white",
        bg: "blue",
        border: {
          fg: "#FFFFFF"
        }
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