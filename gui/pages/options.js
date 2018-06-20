const blessed = require("blessed");
const client = require("../../api/open-nebula/opennebula");
const history = require("../../lib/configs/history.js");

module.exports = class OptionsPage {
  constructor(state) {
    this.screen = state.screen;
    this.layout = state.layout;
    this.box = undefined;
    this.list = undefined;
    this.options = ["My VM's", "My Hosts", "Configurations"];

    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    this.createList();
  }

  onOptionsSelect(index) {
    const self = this;

    switch (index) {
      case 0:
        history.redirect(
          require("./../index.js").VmsListPage,
          {
            screen: this.screen,
            layout: this.layout
          },
          this.done
        );
        break;
      case 1:
        //   history.redirect(
        //     require("./index.js").VmDashboardPage,
        //     {
        //       screen: this.screen,
        //       layout: this.layout,
        //       id: this.vmID
        //     },
        //     this.done
        //   );
        break;
      case 2:
        history.redirect(
          require("./../index.js").ConfigurationsListPage,
          {
            screen: this.screen,
            layout: this.layout
          },
          this.done
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
      bg: "grey"
    });
    this.list.setItems(this.options);

    this.list.on("select", function(data) {
      const index = self.list.selected;
      self.onOptionsSelect(index);
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
      right: 10,
      width: "80%",
      height: "75%",
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
