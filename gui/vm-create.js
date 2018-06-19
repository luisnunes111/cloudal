const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula.js");
const history = require("../lib/configs/history.js");

const TerminalNotification = require("../lib/components/notifications.js");

module.exports = class VmCreatePage {
  constructor(state) {
    this.screen = state.screen;
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
      parent: this.screen,
      top: "center",
      right: 10,
      width: "80%",
      height: "70%",
      keys: true,
      vi: true
    });

    this.nameLabel = blessed.text({
      parent: this.form,
      top: 2,
      left: 0,
      content: "NAME:"
    });

    this.nameInput = blessed.textbox({
      parent: this.form,
      name: "name",
      top: 4,
      left: 0,
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

    this.ramLabel = blessed.text({
      parent: this.form,
      top: 6,
      left: 0,
      content: "RAM:"
    });

    this.ramInput = blessed.textbox({
      parent: this.form,
      name: "ram",
      top: 8,
      left: 0,
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

    this.vcpuLabel = blessed.text({
      parent: this.form,
      top: 10,
      left: 0,
      content: "VCPU:"
    });

    this.vcpuInput = blessed.textbox({
      parent: this.form,
      name: "vcpu",
      top: 12,
      left: 0,
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
      top: 25,
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
      top: 25,
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
      const name = data.name === "" ? undefined : data.name;
      const ram = data.ram === "" ? undefined : data.ram;
      const vcpu = data.vcpu === "" ? undefined : data.vcpu;

      const res = await client.createVM(name, ram, vcpu);
      if (res instanceof Error) {
        TerminalNotification.error(this.screen, res.message);
      } else {
        history.redirect(
          require("./index.js").VmsListPage, {
            screen: this.screen
          },
          this.done,
          false
        );
        TerminalNotification.success(this.screen, "VM created successfully");
      }
    });

    this.form.on("reset", async () => {
      history.redirect(
        require("./index.js").VmsListPage, {
          screen: this.screen
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
    // this.cancelButton.destroy();
    // this.submitButton.destroy();
    // this.nameLabel.destroy();
    // this.nameInput.destroy();
    this.screen.render();
  }
};