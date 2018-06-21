const blessed = require("blessed");
const Prompt = require("./prompt.js");

module.exports = class VmMigratePrompt extends Prompt {
  constructor(screen, text, normalOption, forceOption) {
    super(screen, text);
    this.normalOption = normalOption;
    this.forceOption = forceOption;
    this.init();
  }

  init() {
    var self = this;

    this.nameLabel = blessed.text({
      parent: this.prompt,
      top: 2,
      left: 2,
      content: "HOST ID:",
      style: {
        fg: "#000",
        bg: "cyan",
        border: {
          type: "line"
        }
      }
    });

    this.input = blessed.textbox({
      parent: this.prompt,
      name: "hostId",
      top: 2,
      left: 13,
      height: 2,
      width: 17,
      inputOnFocus: true,
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

    this.prompt.force = blessed.button({
      parent: this.prompt,
      top: 5,
      height: 1,
      left: 2,
      width: 6,
      content: "Live",
      align: "center",
      bg: "cyan",
      hoverBg: "blue",
      mouse: true,
      style: {
        bg: "lightblack",
        focus: {
          bg: "lightblue"
        }
      }
    });

    this.prompt.normal = blessed.button({
      parent: this.prompt,
      top: 5,
      height: 1,
      left: 10,
      width: 6,
      content: "Normal",
      align: "center",
      bg: "cyan",
      hoverBg: "blue",
      mouse: true,
      style: {
        bg: "lightblack",
        focus: {
          bg: "lightblue"
        }
      }
    });

    this.prompt.cancel = blessed.button({
      parent: this.prompt,
      top: 5,
      height: 1,
      shrink: true,
      left: 18,
      width: 8,
      content: "Cancel",
      align: "center",
      bg: "cyan",
      hoverBg: "blue",
      mouse: true,
      style: {
        bg: "lightblack",
        focus: {
          bg: "lightblue"
        }
      }
    });

    this.prompt.force.on("press", async () => {
      const data = this.prompt.submit();
      await self.forceOption(true, data.hostId);
      self.done();
    });

    this.prompt.normal.on("press", async () => {
      const data = this.prompt.submit();
      await self.normalOption(false, data.hostId);
      self.done();
    });

    this.prompt.cancel.on("press", () => {
      self.done();
    });

    this.prompt.on("keypress", (ch, key) => {
      if (key.name == "q") {
        self.done();
      }
    });
    this.prompt.show();
    this.screen.saveFocus();
    this.prompt.focus();
    this.screen.render();
  }

  done() {
    this.screen.restoreFocus();
    this.prompt.destroy();
    this.screen.render();

    // this.prompt.okay.removeListener("press", this.okay);
    // this.prompt.cancel.removeListener("press", this.cancel);
  }
};
