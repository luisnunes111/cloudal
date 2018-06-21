const blessed = require("blessed");
const history = require("../../../lib/configs/history.js");
const options = require("../../../configurations.json");
const chalk = require("chalk");


module.exports = class ConfigurationsListPage {
  constructor(state) {
    this.screen = state.screen;
    this.layout = state.layout;
    this.box = undefined;
    this.list = undefined;

    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    this.createList();
    this.loadList();
  }

  loadList() {
    Object.keys(options).map((vm, index) =>
      this.list.insertItem(index, options[vm].provider)
    );
    this.list.select(0);
    this.screen.render();
    this.list.focus();
  }

  onProviderSelect(index) {
    history.redirect(
      require("../../index.js").ConfigurationsPage, {
        screen: this.screen,
        layout: this.layout,
        id: index
      },
      this.done
    );
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

    this.list.on("select", function (data) {
      const index = self.list.selected;
      self.onProviderSelect(index);
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
      parent: this.layout,
      top: "center",
      right: 10,
      width: "80%",
      height: "75%",
      tags: true,
      content: chalk.white.bgCyanBright.bold("Configuration List Page"),

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