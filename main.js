const blessed = require("blessed"),
  VmsListPage = require("./gui/vms-list.js"),
  chalk = require('chalk');

const screen = blessed.screen({
  smartCSR: true
});
screen.title = "Cloud Computing - VM Terminal";
screen.key(["escape", "C-c"], (ch, key) => {
  return process.exit(0);
});


// // const Home = new HomePage(Screen);



const containerBox = blessed.box({
  parent: screen,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  //content: "Container Box",
  tags: true,
  border: {
    type: "line"
  },
  style: {
    fg: "white",
    bg: "blue",
    border: {
      fg: "#FFFFFF"
    }
  }
});
const titleBox = blessed.box({
  parent: containerBox,
  top: 2,
  left: "center",
  width: "50%",
  height: "10%",
  content: chalk.white.bgCyanBright.bold('Cloud Computing - VM Terminal -> cloudal by Luís Nunes & Rafael Escudeiro'),
  align: "center",
  tags: true,

  style: {
    fg: "white",
    bg: "blue"
  }
});
var png = blessed.png({
  parent: containerBox,
  width: "10%",
  height: "20%",
  top: 2,
  left: 0,
  file: __dirname + '/images/cloudal3.png',
  scale: 1
});

const mainBox = blessed.box({
  parent: containerBox,
  top: "10%",
  right: 0,
  width: "88%",
  height: "80%",
  //content: "Main Box",
  tags: true,
  border: {
    type: "line"
  },
  style: {
    fg: "white",
    bg: "blue",
    border: {
      fg: "#FFFFFF"
    }
  }
});
const commandBox = blessed.box({
  parent: containerBox,
  right: 0,
  bottom: 0,
  width: "88%",
  height: "8%",
  content: chalk.white.bgCyanBright.bold('Commands:') + chalk.red.bold('            [EXIT]:Ctrl+C      ') + chalk.green.bold('      [SELECT]:Enter      ') + chalk.yellow.bold('      [BACK]:z      ' + chalk.white.bold('      [UP]:') + chalk.magenta.bold('▲      ') + chalk.white.bold('      [DOWN]:') + chalk.magenta.bold('▼      ')),
  align: "center",
  tags: true,
  border: {
    type: "line"
  },
  style: {
    fg: "white",
    bg: "black",
    border: {
      fg: "#FFFFFF"
    }
  }
});
const historyBox = blessed.box({
  parent: containerBox,
  top: "center",
  left: 0,
  width: "10%",
  height: "50%",
  content: "History Box",
  tags: true,
  border: {
    type: "line"
  },
  style: {
    fg: "white",
    bg: "blue",
    border: {
      fg: "#FFFFFF"
    }
  }
});


const List = new VmsListPage({
  screen: screen
});