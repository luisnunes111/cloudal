const blessed = require("blessed"),
  Screen = require("./lib/components/screen"),
  VmsListPage = require("./gui/vms-list.js"),
  VmOptionsPage = require("./gui/vm-options.js");

const screen = blessed.screen({
  smartCSR: true
});
screen.title = "Cloud computing";

screen.key(["escape", "C-c"], (ch, key) => {
  return process.exit(0);
});

// // const Home = new HomePage(Screen);
const List = new VmsListPage({ screen: screen, redirectPage: VmOptionsPage });
