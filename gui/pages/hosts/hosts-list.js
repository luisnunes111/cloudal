const blessed = require("blessed");
const client = require("../../../api/open-nebula/opennebula");
const history = require("../../../lib/configs/history.js");
const chalk = require("chalk");

module.exports = class HostsListPage {
  constructor(state) {
    this.screen = state.screen;
    this.layout = state.layout;
    this.box = undefined;
    this.list = undefined;

    this.hosts = [];
    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createBox();
    this.createList();
    this.loadList();
  }

  async loadList() {
    this.hosts = await client.getAllHosts();

    if (this.hosts) {
      this.hosts.map((host, index) =>
        this.list.insertItem(index + 1, host.NAME.toString())
      );
      this.list.select(0);
      this.screen.render();
      this.list.focus();
    }
  }

  onHostSelect(index) {
    const self = this;

    //if NEW option was selected
    if (index === 0) {
      const state = {
        screen: this.screen,
        layout: this.layout
      }; //redirect para o create
      history.redirect(
        require("./../../index.js").HostCreatePage,
        state,
        this.done.bind(this)
      );
    } else {
      const state = {
        screen: this.screen,
        layout: this.layout,
        id: this.hosts[index - 1].ID
      }; //redirect para a dashboard
      history.redirect(
        require("./../../index.js").HostDashboardPage,
        state,
        this.done.bind(this)
      );
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
    this.list.insertItem(0, "------------NEW HOST------------");

    this.list.on("select", function (data) {
      const index = self.list.selected;
      self.onHostSelect(index);
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
      content: chalk.white.bgCyanBright.bold("Host List Page"),
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