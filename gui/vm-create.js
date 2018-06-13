const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const VmOptionsPage = require("./vm-options.js");

module.exports = class VmCreatePage {
  constructor(screen) {
    this.screen = screen;
    this.box = undefined;
    this.init();
  }

  init() {
    this.createForm();
  }

  // onSubmit(data) {
  //   // const optionsPage = new VmOptionsPage(this.screen, this.VMs[index].ID);
  // }

  createForm() {
    var form = blessed.form({
      parent: this.screen,
      width: "90%",
      left: "center",
      keys: true,
      vi: true
    });

    var label1 = blessed.text({
      parent: form,
      top: 2,
      left: 0,
      content: "NAME:"
    });
    var firstName = blessed.textbox({
      parent: form,
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

    firstName.focus();

    // Submit/Cancel buttons
    var submit = blessed.button({
      parent: form,
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
      parent: form,
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
      form.submit();
    });
    reset.on("press", function() {
      form.reset();
    });

    form.on("submit", function(data) {
      msg.setContent("Submitted.");
      this.screen.render();
    });
    
    this.screen.render();
  }
};
