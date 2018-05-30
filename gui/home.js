let screen = require('./../main');
const blessed = require('blessed');

module.exports = class HomePage {
    constructor(screen){
        this.screen = screen;
        this.box = undefined;
    }

    render(){
        // Create a box perfectly centered horizontally and vertically.
        const box = blessed.box({
            top: 'center',
            left: 'center',
            width: '50%',
            height: '50%',
            content: 'Headsfsafllo {bold}world{/bold}!',
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
        
        // Append our box to the screen.
        this.screen.append(box);
        
        // If box is focused, handle `enter`/`return` and give us some more content.
        // box.key('enter', function(ch, key) {
        //     console.log(this)
        //     box.setContent('{right}Even different {black-fg}content{/black-fg}.{/right}\n');
        //     box.setLine(1, 'bar');
        //     box.insertLine(1, 'foo');
        //     // this.screen.render();
        // });
        
        // Focus our element.
        box.focus();
        
        // Render the screen.
        this.screen.render();
        this.box=box;
    }
}
