const blessed = require('blessed');

module.exports = class HomePage {

    constructor(screen) {
        this.screen = screen;
        this.box = undefined;
        this.init();
    }

    init() {
        // Create a box perfectly centered horizontally and vertically.
        this.box = blessed.box({
            top: 'center',
            left: 'center',
            width: '50%',
            height: '50%',
            content: 'Hello {bold}world{/bold}!',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'magenta',
                border: {
                    fg: '#f0f0f0'
                }
            }
        });

        // If box is focused, handle `enter`/`return` and give us some more content.
        this.box.key('enter', function (ch, key) {
            this.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
            this.setLine(1, 'bar');
            this.insertLine(1, 'foo');
            this.screen.render();
        });

        // Focus our element.
        this.box.focus();
        // Append our box to the screen.
        this.screen.append(this.box);
        // Render the screen.
        this.screen.render();
    }
}
//hosts(exemplo: "maquina 1: memoria, cpu...."")

//dados dos graficos