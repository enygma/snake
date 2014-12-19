var Board = function(board)
{
    this.context = board.getContext('2d'),
        this.cellWidth = 10,
        this.cellHeight = 10,
        this.rows = 0,
        this.cols = 0,
        this.currentX = 0,
        this.currentY = 0,
        this.track = new Array(),
        this.randomMarker = {},
        this.length = 1,
        this.direction = 'up',
        this.rate = 300;
        this.score = 0;
        this.fail = false;

    this.render = function()
    {
        this.cols = Math.floor(board.width/this.cellWidth);
        this.rows = Math.floor(board.height/this.cellHeight);

        this.drawLines(this.rows, this.cols);

        var x = ((this.cols/2) * this.cellWidth) - (this.cols/2);
        var y = ((this.rows/2) * this.cellHeight) - (this.rows/2);

        // Reset the location of our snake "head"
        this.currentX = x;
        this.currentY = y;
        this.drawMarker(x, y);

        // Add this to our tracking
        this.track.push({x: x, y: y});

        this.drawRandomMarker();
    };
    this.drawLines = function(rows, cols)
    {
        var yStart = 0;

        for (var i = 0; i < rows; i++) {
            this.drawRow(yStart, cols);
            yStart += this.cellHeight;
        }
    }
    this.drawRow = function(line, cols)
    {
        var xStart = 0;

        for (var i = 0; i < cols; i++) {
            this.context.strokeStyle = '#e0e0e0';
            this.context.strokeRect(xStart, line, this.cellWidth, this.cellHeight);
            xStart += this.cellWidth;
        }
    };
    this.drawMarker = function(x, y, color)
    {
        if (typeof color == 'undefined') {
            color = '#000000';
        }
        this.context.fillStyle = color;
        this.context.fillRect(x, y, this.cellWidth, this.cellHeight);

        // Check our length and remove the right amount from the end
        if (this.track.length > this.length) {
            var item = this.track.shift();
            this.removeMarker(item.x, item.y);
        }
    };
    this.drawRandomMarker = function()
    {
        var x = Math.floor(Math.random() * this.cols) * this.cellWidth;
        var y = Math.floor(Math.random() * this.rows) * this.cellHeight;
        var self = this;
        var overlay = false;

        // Be sure it's not generated anyplace our snake is
        $.each(this.track, function(index, cell) {
            if (Math.round(cell.x) == x && Math.round(cell.y) == y) {
                overlay = true;
                self.drawRandomMarker();
            }
        });

        if (overlay == false) {
            this.randomMarker = {x: x, y: y};
            this.drawMarker(x, y, '#1a76bf');
        }
    }
    this.removeMarker = function(x, y)
    {
        this.context.fillStyle = '#FFFFFF';
        this.context.fillRect(x, y, this.cellWidth, this.cellHeight);
    }
    this.collisionCheck = function(x, y)
    {
        // See if we have a collision
        $.each(this.track, function(index, cell) {
            if (cell.x == x && cell.y == y) {
                console.log('collide!');
                return true;
            }
        });
        return false;
    };
    this.boundsCheck = function(x, y)
    {
        if ((x + this.cellWidth) > board.width) {
            this.fail = true;
            throw 'Out of bounds - right!';
        } else if (x + this.cellWidth < 0) {
            this.fail = true;
            throw 'Out of bounds - left!';
        } else if (y + this.cellHeight < 0) {
            this.fail = true;
            throw 'Out of bounds - top!';
        } else if (y + this.cellHeight > board.height) {
            this.fail = true;
            throw 'Out of bounds - bottom!';
        }
    };
    this.matchCheck = function(x, y)
    {
        if (Math.round(x) == this.randomMarker.x && Math.round(y) == this.randomMarker.y) {
            this.updateScore();
            this.length++;
            this.drawRandomMarker();
        }
    };
    this.updateScore = function()
    {
        this.score++;
        $('#score').html(this.score);
    };
    this.moveMarker = function(x, y)
    {
        var x = (this.currentX + x),
            y = (this.currentY + y),
            self = this;

        this.boundsCheck(x, y);
        this.matchCheck(x, y);
        this.collisionCheck(x, y);

        // Reset the location of our snake "head"
        this.currentX = x;
        this.currentY = y;

        // Add this to our tracking
        this.track.push({x: x, y: y});

        window.requestAnimationFrame(function() {
            self.drawMarker(x, y);
        });
    };
    this.changeDirection = function(e)
    {
        switch(e.which) {
            case 37:
                this.direction = 'left';
                break;
            case 38:
                this.direction = 'up';
                break;
            case 39:
                this.direction = 'right';
                break;
            case 40:
                this.direction = 'down';
                break;
        }
    };
    this.slither = function()
    {
        switch(this.direction) {
            case 'up': this.moveMarker(0, -10); break;
            case 'down': this.moveMarker(0, 10); break;
            case 'left': this.moveMarker(-10, 0); break;
            case 'right': this.moveMarker(10, 0); break;
        }
    }
};