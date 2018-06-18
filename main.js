const blessed = require("blessed"),
  VmsListPage = require("./gui/vms-list.js"),
  Layout = require("./lib/components/layout.js"),
  HomePage = require("./gui/home.js"),
  chalk = require('chalk');

const screen = blessed.screen({
  smartCSR: true
});
screen.title = "Cloud Computing - VM Terminal";
screen.key(["escape", "C-c"], (ch, key) => {
  return process.exit(0);
});


// // const Home = new HomePage(Screen);

const layout = new Layout(screen);

const home = new HomePage({
  screen: screen
});