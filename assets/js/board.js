
//-----------------------------------------
var Draw = function(context)
{
    this.context = context;

    this.cell = function(x, y, width, height, color)
    {
        this.context.strokeStyle = '#e0e0e0';
        this.context.strokeRect(x, y, width, height);
    }
    this.marker = function(x, y, width, height, color)
    {
        if (typeof color == 'undefined') {
            color = '#000000';
        }
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }
    this.removeMarker = function(x, y, width, height)
    {
        this.context.fillStyle = '#FFFFFF';
        this.context.fillRect(x, y, width, width);
    };
    this.random = function(data, cols, rows, width, height)
    {
        var x = Math.floor(Math.random() * cols) * width;
        var y = Math.floor(Math.random() * rows) * height;

        var found = false;
        $.each(data, function(index, cell) {
            if (Math.round(cell.x) == x && Math.round(cell.y) == y) {
                found = true;
            }
        });

        if (found == true) {
            return this.random(data, cols, rows, width, height);
        } else {
            this.marker(x, y, width, height, '#1a76bf');
            return {x: x, y: y};
        }
    };
};

//-----------------------------------------
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
            case 37: this.direction = 'left'; break;
            case 38: this.direction = 'up'; break;
            case 39: this.direction = 'right'; break;
            case 40: this.direction = 'down'; break;
        }
    };
};

//-----------------------------------------
var Board = function(board, snake, draw)
{
    this.context = board.getContext('2d'),

        this.draw = draw,
        this.snake = snake,

        this.cellWidth = 10,
        this.cellHeight = 10,
        this.rows = 0,
        this.cols = 0,
        this.randomMarker = {},
        this.score = 0,
        this.fail = false,
        this.pause = false;

    this.render = function()
    {
        this.cols = Math.floor(board.width/this.cellWidth);
        this.rows = Math.floor(board.height/this.cellHeight);

        this.drawLines(this.rows, this.cols);

        var x = ((this.cols/2) * this.cellWidth) - (this.cols/2);
        var y = ((this.rows/2) * this.cellHeight) - (this.rows/2);

        // Start up the snake in the middle and put a random marker in place
        this.snake.start(x, y);
        this.randomMarker = this.draw.random(
            this.snake.track, this.cols, this.rows, this.cellWidth, this.cellHeight
        );
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
            this.draw.cell(xStart, line, this.cellWidth, this.cellHeight);
            xStart += this.cellWidth;
        }
    };
    this.collisionCheck = function(x, y)
    {
        // Take off the last one since it's the head
        var track = this.snake.track.slice(1, this.snake.track.length - 1);
        var collide = false;

        // See if we have a collision
        $.each(track, function(index, cell) {
            if (cell.x == x && cell.y == y) {
                collide = true;
            }
        });
        if (collide == true) {
            throw 'Collision!';
        }
        return collide;
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
            this.snake.length++;

            this.randomMarker = this.draw.random(
                this.snake.track, this.cols, this.rows, this.cellHeight, this.cellWidth
            );
        }
    };
    this.updateScore = function()
    {
        this.score++;
        $('#score').html(this.score);
    };
    this.advance = function()
    {
        var moved = snake.slither();

        // See if we did something wrong
        this.boundsCheck(moved.x, moved.y);
        this.collisionCheck(moved.x, moved.y);
        this.matchCheck(moved.x, moved.y);
    }
};