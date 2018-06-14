const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");

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

    const state = { screen: this.screen, id: this.VMs[index].ID }; //redirect para as options
    history.redirect(this.redirectPage, state, function() {
      self.done();
    });
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

    this.list.on("select", function(data) {
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
        this.list.insertItem(index, "VM" + vm.ID.toString())
      );

      this.list.select(0);
      this.screen.render();
    }
  }

  createBox() {
    this.box = blessed.box({
      top: "center",
      left: "center",
      width: "50%",
      height: "50%",
      content: "List page!",
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

    // Append our box to the screen.
    this.screen.append(this.box);

    var icon = blessed.image({
      parent: this.box,
      top: 50,
      left: 50,
      type: 'overlay',
      width: 'shrink',
      height: 'shrink',
      file: __dirname + '/wifi.PNG',
      search: false
    });


    this.screen.render();
  }

  done() {
    this.box.destroy();
    this.list.destroy();
    this.screen.render();
  }
};