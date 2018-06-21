const blessed = require("blessed");
const client = require("../../../api/open-nebula/opennebula.js");
const history = require("../../../lib/configs/history.js");
const chalk = require("chalk");

// const VmCreatePage = require("./vm-create.js");

module.exports = class VmsListPage {
  constructor(state) {
    this.screen = state.screen;
    this.layout = state.layout;
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

    //if NEW option was selected
    if (index === 0) {
      const state = {
        screen: this.screen,
        layout: this.layout
      }; //redirect para o create
      history.redirect(require("../../index.js").VmCreatePage, state, function () {
        self.done();
      });
    } else {
      const state = {
        screen: this.screen,
        layout: this.layout,
        id: this.VMs[index - 1].ID
      }; //redirect para as options
      history.redirect(require("../../index.js").VmOptionsPage, state, function () {
        self.done();
      });
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
      bg: "grey"
    });
    this.list.insertItem(0, "------------NEW VIRTUAL MACHINE------------");

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
        this.list.insertItem(
          index + 1,
          "VM" + vm.ID.toString() + ": " + vm.NAME.toString()
        )
      );
      this.list.select(0);
      this.screen.render();
      this.list.focus();
    }
  }

  createBox() {
    this.box = blessed.box({
      parent: this.screen,
      top: "center",
      right: 10,
      width: "80%",
      height: "75%",
      content: chalk.white.bgCyanBright.bold("Virtual Machine List Page"),
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