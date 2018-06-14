const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const VmOptionsPage = require("./vm-options.js");
const history = require("../lib/configs/history.js");

module.exports = class VmCreatePage {
  constructor(state) {
    this.screen = state.screen;
    this.form = undefined;
    this.init();
  }

  init() {
    this.createForm();
  }

  // onSubmit(data) {
  //   // const optionsPage = new VmOptionsPage(this.screen, this.VMs[index].ID);
  // }

  createForm() {
    const self = this;

    this.form = blessed.form({
      parent: this.screen,
      width: "90%",
      left: "center",
      keys: true,
      vi: true
    });

    var label1 = blessed.text({
      parent: this.form,
      top: 2,
      left: 0,
      content: "NAME:"
    });
    var firstName = blessed.textbox({
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

    // Submit/Cancel buttons
    var submit = blessed.button({
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
    var reset = blessed.button({
      parent: this.form,
      name: "reset",
      content: "Reset",
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
    // Info
    var msg = blessed.message({
      parent: this.screen,
      top: 28,
      left: 5,
      style: {
        italic: true,
        fg: "green"
      }
    });

    // Event management
    submit.on("press", function() {
      self.form.submit();
    });
    reset.on("press", function() {
      self.form.reset();
    });

    this.form.on("submit", function(data) {
      msg.setContent("Submitted.");
      self.screen.render();
    });

    this.form.key("z", (ch, key) => {
      history.back();
      self.done();
    });

    this.form.key("x", (ch, key) => {
      history.foward();
      self.done();
    });

    this.form.focus();
    this.screen.render();
  }

  done() {
    this.form.destroy();
    this.screen.render();
  }
};
