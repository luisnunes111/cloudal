const blessed = require("blessed");
const client = require("../../../api/open-nebula/opennebula.js");
const history = require("../../../lib/configs/history.js");
const chalk = require("chalk");


const TerminalNotification = require("../../../lib/components/notifications.js");

module.exports = class HostCreatePage {
  constructor(state) {
    this.screen = state.screen;
    this.layout = state.layout;
    this.form = undefined;
    this.init();

    this.done = this.done.bind(this);
  }

  init() {
    this.createForm();
  }

  createForm() {
    const self = this;

    this.form = blessed.form({
      parent: this.layout,
      top: "center",
      right: 10,
      width: "80%",
      height: "70%",
      content: chalk.white.bgCyanBright.bold("Host Create Page"),
      keys: true,
      vi: true
    });

    this.nameLabel = blessed.text({
      parent: this.form,
      top: 2,
      left: 5,
      right: 5,
      content: "NAME:"
    });

    this.nameInput = blessed.textbox({
      parent: this.form,
      name: "name",
      top: 4,
      left: 5,
      right: 5,
      height: 2,
      inputOnFocus: true,
      padding: {
        right: 2,
        left: 2
      },
      style: {
        bg: "#ccc",
        fg: "#000",
        border: {
          type: "line"
        },
        focus: {
          fg: "white",
          bg: "blue"
        }
      }
    });

    // Submit/Cancel buttons
    this.submitButton = blessed.button({
      parent: this.form,
      name: "submit",
      content: "Submit",
      top: 16,
      right: 5,
      shrink: true,
      padding: {
        top: 1,
        right: 2,
        bottom: 1,
        left: 2
      },
      style: {
        bold: true,
        fg: "white",
        bg: "green",
        focus: {
          inverse: true
        }
      }
    });
    this.cancelButton = blessed.button({
      parent: this.form,
      name: "cancel",
      content: "Cancel",
      top: 16,
      right: 15,
      shrink: true,
      padding: {
        top: 1,
        right: 2,
        bottom: 1,
        left: 2
      },
      style: {
        bold: true,
        fg: "white",
        bg: "red",
        focus: {
          inverse: true
        }
      }
    });

    // Event management
    this.submitButton.on("press", function () {
      self.form.submit();
    });
    this.cancelButton.on("press", function () {
      self.form.reset();
    });

    this.form.on("submit", async data => {
      const name = data.name || "";

      const res = await client.createHost(name);
      if (res instanceof Error) {
        TerminalNotification.error(this.screen, res.message);
      } else {
        history.redirect(
          require("./../../index.js").HostsListPage, {
            screen: this.screen,
            layout: this.layout
          },
          this.done,
          false
        );
        TerminalNotification.success(this.screen, "Host created successfully");
      }
    });

    this.form.on("reset", async () => {
      history.redirect(
        require("./../../index.js").HostsListPage, {
          screen: this.screen,
          layout: this.layout
        },
        this.done,
        false
      );
    });

    this.form.key("z", (ch, key) => {
      history.back(self.done);
    });

    this.form.key("x", (ch, key) => {
      history.foward(self.done);
    });

    this.form.focus();
    this.screen.render();
  }

  done() {
    this.form.destroy();
    this.screen.render();
  }
};