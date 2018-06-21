const blessed = require("blessed");
const client = require("../../../api/open-nebula/opennebula.js");
const history = require("../../../lib/configs/history.js");
const fs = require("fs");
const path = require("path");

const TerminalNotification = require("../../../lib/components/notifications.js");
const filePath = path.join(__dirname, "../../..", "configurations.json");

module.exports = class ConfigurationsPage {
  constructor(state) {
    this.configID = state.id;
    this.layout = state.layout;
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
      height: "80%",
      keys: true,
      vi: true
    });

    this.ipLabel = blessed.text({
      parent: this.form,
      top: 1,
      left: 5,
      right: 5,
      content: "IP:"
    });

    this.ipInput = blessed.textbox({
      parent: this.form,
      name: "ip",
      top: 3,
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

    this.usernameLabel = blessed.text({
      parent: this.form,
      top: 6,
      left: 5,
      right: 5,
      content: "USERNAME:"
    });

    this.usernameInput = blessed.textbox({
      parent: this.form,
      name: "username",
      top: 8,
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

    this.passwordLabel = blessed.text({
      parent: this.form,
      top: 11,
      left: 5,
      right: 5,
      content: "PASSWORD:"
    });

    this.passwordInput = blessed.textbox({
      parent: this.form,
      name: "password",
      top: 13,
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

    fs.readFile(filePath, "utf8", (err, fileData) => {
      if (fileData) {
        var newOptions = JSON.parse(fileData);
        const selectedOption =
          newOptions[Object.keys(newOptions)[this.configID]];
        this.ipInput.setValue("" + selectedOption.ip);
        const auth = selectedOption.credentials.split(":");
        if (auth.length > 0) {
          this.usernameInput.setValue("" + auth[0]);
          this.passwordInput.setValue("" + auth[1]);
        }
        this.screen.render();
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
    this.submitButton.on("press", function() {
      self.form.submit();
    });
    this.cancelButton.on("press", function() {
      self.form.reset();
    });

    this.form.on("submit", data => {
      fs.readFile(filePath, "utf8", (err, fileData) => {
        if (err) {
          TerminalNotification.error(
            this.screen,
            "Error loading the configurations file"
          );
        } else {
          var newOptions = JSON.parse(fileData);
          newOptions[Object.keys(newOptions)[this.configID]] = {
            ip: data.ip || "",
            credentials: (data.username || "") + ":" + (data.password || ""),
            provider:
              newOptions[Object.keys(newOptions)[this.configID]].provider
          };

          const json = JSON.stringify(newOptions); //convert it back to json
          fs.writeFile(filePath, json, "utf8", () => {
            history.redirect(
              require("../../index").Home,
              {
                screen: this.screen,
                layout: this.layout
              },
              this.done
            );

            TerminalNotification.success(this.screen, "Configurations saved");
          });
        }
      });
    });

    this.form.on("reset", async () => {
      history.redirect(
        require("../../index.js").Home,
        {
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
    // this.cancelButton.destroy();
    // this.submitButton.destroy();
    // this.nameLabel.destroy();
    // this.nameInput.destroy();
    this.screen.render();
  }
};
