const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");
const chalk = require('chalk');


module.exports = class VmsListPage {
  constructor(state) {
    this.screen = state.screen;
    this.redirectPage = state.redirectPage;
    this.box = undefined;
    this.list = undefined;
    this.VMs = [];
    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    this.createList();
    this.loadList().then(data => {
      this.updateList(data);
    });
  }

  async loadList() {
    this.VMs = await client.getAllVMs();
    return this.VMs;
  }

  onVmSelect(index) {
    const self = this;

    const state = {
      screen: this.screen,
      id: this.VMs[index].ID
    }; //redirect para as options
    history.redirect(this.redirectPage, state, function () {
      self.done();
    });
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

    this.list.on("select", function (data) {
      const index = self.list.selected;
      self.onVmSelect(index);
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

  updateList(vms) {
    if (vms) {
      vms.map((vm, index) =>
        this.list.insertItem(index, "Virtual Machine " + vm.ID.toString())
      );
      this.list.select(0);
      this.screen.render();
    }
  }

  createBox() {
    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      left: "center",
      width: "95%",
      height: "90%",
      content: chalk.white.bgCyanBright.bold('Virtual Machine List Page'),
      tags: true,
      style: {
        fg: "white",
        bg: "blue"
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