const blessed = require("blessed");
const client = require("../api/open-nebula/opennebula");
const history = require("../lib/configs/history.js");
const chalk = require('chalk');

// const VmCreatePage = require("./vm-create.js");

module.exports = class HomePage {
    constructor(state) {
        this.screen = state.screen;
        this.box = undefined;
        this.list = undefined;
        this.init();

        this.done = this.done.bind(this);
    }

    init() {
        this.createBox();
        this.createList();

    }

    onOptionSelect(index) {
        const self = this;

        //if START option was selected
        if (index === 0) {
            const state = {
                screen: this.screen
            }; //redirect para a lista de VMs
            history.redirect(require("./index.js").VmsListPage, state, function () {
                self.done();
            });
        } else {
            return process.exit(0);
        }
    }

    createList() {
        const self = this;
        var png = blessed.png({
            parent: this.screen,
            width: "50%",
            height: "33%",
            top: "center",
            left: "center",
            file: __dirname + '/images/cloudal2.png',
            scale: 1
        });

        this.list = blessed.list({
            parent: this.box,
            align: "center",
            width: "90%",
            height: "90%",
            top: "center",
            left: "center",
            keys: true,
            mouse: true,
            selectedBg: "cyan",
            fg: "white",
            bg: "grey"
        });
        this.list.insertItem(0, "START");
        this.list.insertItem(1, "EXIT");
        this.list.on("select", function (data) {
            const index = self.list.selected;
            self.onOptionSelect(index);
        });

        this.screen.render();

        this.list.focus();
    }

    createBox() {
        this.box = blessed.box({
            parent: this.screen,
            top: "center",
            right: 10,
            width: "80%",
            height: "75%",
            tags: true,
            style: {
                fg: "white",
                bg: "blue"
            }
        });


        this.screen.render();
    }

    done() {
        this.box.destroy();
        this.list.destroy();
        this.screen.render();
    }
};