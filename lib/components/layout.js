const blessed = require("blessed");

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
            top: 0,
            left: "center",
            width: "50%",
            height: "10%",
            content: "Title Box",
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
            height: "10%",
            content: "Command Box",
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