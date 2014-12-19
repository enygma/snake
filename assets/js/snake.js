var Snake = function(draw)
{
    this.draw = draw;
    this.currentX = 0;
    this.currentY = 0;
    this.track = new Array();
    this.length = 1;
    this.direction = 'up';
    this.rate = 300;
    this.cellHeight = 10;
    this.cellWidth = 10;

    this.setCurrent = function(x, y)
    {
        this.currentX = x;
        this.currentY = y;
    };
    this.getCurrent = function()
    {
        return {
            x: this.currentX,
            y: this.currentY
        }
    };
    this.start = function(x, y)
    {
        this.setCurrent(x, y);
        this.track.push({x: x, y: y});

        this.draw.marker(x, y, 10, 10);
    };
    this.trim = function()
    {
        // Check our length and remove the right amount from the end
        if (this.track.length > this.length) {
            var item = this.track.shift();
            this.draw.removeMarker(item.x, item.y, this.cellWidth, this.cellHeight);
        }
    };
    this.move = function(x, y, width, height)
    {
        var self = this;
        var x = this.currentX + x;
        var y = this.currentY + y;

        this.setCurrent(x, y);

        // move the snake head to the new location
        this.track.push({x: x, y: y});

        window.requestAnimationFrame(function() {
            self.draw.marker(x, y, width, height);
        });

        this.trim();

        // retuned where we moved to
        return {x: x, y: y};
    };
    this.slither = function()
    {
        var x = 0;
        var y = 0;

        switch(this.direction) {
            case 'up':
                x = 0; y = -10; break;
            case 'down':
                x = 0; y = 10; break;
            case 'left':
                x = -10; y = 0; break;
            case 'right':
                x = 10; y = 0; break;
        }
        return this.move(x, y, this.cellWidth, this.cellHeight);
    };
    this.changeDirection = function(event)
    {
        switch(event.which) {
            case 37:
                if (this.direction !== 'right') {
                    this.direction = 'left';
                }
                break;
            case 38:
                if (this.direction !== 'down') {
                    this.direction = 'up';
                }
                break;
            case 39:
                if (this.direction !== 'left') {
                    this.direction = 'right';
                }
                break;
            case 40:
                if (this.direction !== 'up') {
                    this.direction = 'down';
                }
                break;
        }
    };
};