const blessed = require("blessed");

const chalk = require('chalk');


module.exports = class Layout {
    constructor(screen) {
        this.screen = screen;
        this.containerBox = undefined;
        this.titleBox = undefined;
        this.mainBox = undefined;
        this.commandBox = undefined;
        this.historyBox = undefined;

        this.init();
    }

    init() {


        this.containerBox = blessed.box({
            parent: this.screen,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            content: "Container Box",
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
        this.titleBox = blessed.box({
            parent: this.containerBox,
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
            parent: this.containerBox,
            width: "10%",
            height: "20%",
            top: 2,
            left: 0,
            file: __dirname + '/images/cloudal3.png',
            scale: 1
        });

        this.mainBox = blessed.box({
            parent: this.containerBox,
            top: "10%",
            right: 0,
            width: "88%",
            height: "80%",
            content: "Main Box",
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
        this.commandBox = blessed.box({
            parent: this.containerBox,
            right: 0,
            bottom: 0,
            width: "88%",
            height: "8%",
            content: chalk.white.bgCyanBright.bold('Commands:') + chalk.red.bold('      [EXIT]:Ctrl+C      ') + chalk.green.bold('      [SELECT]:Enter      ') + chalk.yellow.bold('      [BACK]:z      '),
            align: "center",
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
        this.historyBox = blessed.box({
            parent: this.containerBox,
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

        this.screen.saveFocus();

        this.screen.render();
    }

    done() {
        this.screen.restoreFocus();

        this.screen.render();

    }
};