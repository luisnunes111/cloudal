const blessed = require('blessed');

const screen = blessed.screen({
    smartCSR: true
});
screen.title = 'Cloud computing';

screen.key(['escape', 'C-c'], (ch, key) => {
    return process.exit(0);
});

exports.exports = screen;