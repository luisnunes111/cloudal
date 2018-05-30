const blessed = require('blessed');
const HomePage = require('./gui/home.js');

var screen = blessed.screen({
  smartCSR: true
});
screen.title = 'Cloud computing';

screen.key(['escape', 'C-c'], (ch, key) => {
  return process.exit(0);
});

const Home = new HomePage(screen);
Home.render()


