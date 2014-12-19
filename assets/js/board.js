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