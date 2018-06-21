const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");
const chalk = require("chalk");

module.exports = class HomePage {
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
      width: "90%",
      height: "75%",
      keys: true,
      vi: true
    });

    blessed.png({
      parent: this.form,
      width: "90%",
      height: 11,
      top: "10%",
      left: "center",
      file: __dirname + "/images/cloudal2.png",
      scale: 1
    });

    // Start/Exit buttons
    this.startButton = blessed.button({
      parent: this.form,
      name: "start",
      content: "START",
      top: "70%",
      left: "center",
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
    this.exitButton = blessed.button({
      parent: this.form,
      name: "exit",
      content: " EXIT",
      top: "82%",
      left: "center",
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

    const label = blessed.text({
      parent: this.form,
      top: "95%",
      left: "center",
      content:
        "Copyright © cloudal 2018 All Rights Reserved - Luís Nunes & Rafael Escudeiro"
    });

    // Event management
    this.startButton.on("press", function() {
      self.form.submit();
    });
    this.exitButton.on("press", function() {
      self.form.reset();
    });
    this.form.on("submit", async data => {
      history.redirect(
        require("./index.js").OptionsPage,
        {
          screen: this.screen,
          layout: this.layout
        },
        this.done
      );
    });

    this.form.on("reset", async () => {
      return process.exit(0);
    });

    this.startButton.focus();

    this.screen.render();
  }

  done() {
    this.form.destroy();

    this.screen.render();
  }
};
