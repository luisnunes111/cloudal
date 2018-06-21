const blessed = require("blessed");
const client = require("../../api/open-nebula/opennebula");
const history = require("../../lib/configs/history.js");
const chalk = require("chalk");
const VmMigratePrompt = require("../../lib/components/prompts/vm-migrate-prompt.js");
const TerminalNotification = require("../../lib/components/notifications.js");

module.exports = class OptionsPage {
  constructor(state) {
    this.screen = state.screen;
    this.layout = state.layout;
    this.box = undefined;
    this.list = undefined;
    this.options = ["My VMs", "My Hosts", "Configurations", "Evict all VMs"];

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
          require("./../index.js").VmsListPage, {
            screen: this.screen,
            layout: this.layout
          },
          this.done
        );
        break;
      case 1:
        history.redirect(
          require("./../index.js").HostsListPage, {
            screen: this.screen,
            layout: this.layout
          },
          this.done
        );
        break;
      case 2:
        history.redirect(
          require("./../index.js").ConfigurationsListPage, {
            screen: this.screen,
            layout: this.layout
          },
          this.done
        );
        break;

        case 3:
        new VmMigratePrompt(
          this.screen,
          "Are you sure that you want to MIGRATE all the VMs to one host?",
          this.evictVMs.bind(this),
          this.evictVMs.bind(this)
        );
        break;
    }
  }

  
  async evictVMs(isLive, hostId) {
    //check host????

    const userVms = await client.getAllVMs();
    const results = await Promise.all(userVms.map(item => {
      return client.migrateVM(
        parseInt(item.ID),
        parseInt(hostId),
        isLive
      )
    }));

    //check results
    let vmStateCount= 0;
    let error ="";
    results.map(result => {
      if(result instanceof Error){
        vmStateCount = vmStateCount+1;
        error = result.message;
      }
    })

    if(vmStateCount === 0 && userVms.length > 0){
      history.redirect(
        require("../index.js").HostDashboardPage,
        {
          screen: this.screen,
          layout: this.layout,
          id: hostId
        },
        this.done
      );
      TerminalNotification.success(this.screen, "All VMs migrated to host "+hostId+" successfully");
    }
    else if(vmStateCount > 0 && vmStateCount !== userVms.length){
      TerminalNotification.warning(this.screen, "Not all VMs were migrated to the host "+hostId+"");
    }
    else{
      TerminalNotification.error(this.screen, error);
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

    this.list.on("select", function (data) {
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
      content: chalk.white.bgCyanBright.bold("Options Page"),
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