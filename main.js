const blessed = require("blessed"),
  Layout = require("./lib/components/layout.js"),
  history = require("./lib/configs/history.js");

const screen = blessed.screen({
  smartCSR: true
});
screen.title = "Cloud Computing - VM Terminal";
screen.key(["escape", "C-c"], (ch, key) => {
  return process.exit(0);
});

const layout = new Layout(screen);

history.initialize(require("./gui/index").OptionsPage, {
  screen: screen,
  layout: layout.mainBox
});
