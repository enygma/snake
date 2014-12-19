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
        this.pause = false,
        this.interval;

    /**
     * Render the board and kick off the game (start)
     */
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
        this.start();
    },

    /**
     * Draw the cells in the line
     *
     * @param  {integer} rows Number of Rows
     * @param  {integer} cols Number of columns
     */
    this.drawLines = function(rows, cols)
    {
        var yStart = 0;

        for (var i = 0; i < rows; i++) {
            this.drawRow(yStart, cols);
            yStart += this.cellHeight;
        }
    },

    /**
     * Draw a row in the grid
     *
     * @param  {integer} line Current line number
     * @param  {integer} cols Number of columns
     */
    this.drawRow = function(line, cols)
    {
        var xStart = 0;

        for (var i = 0; i < cols; i++) {
            this.draw.cell(xStart, line, this.cellWidth, this.cellHeight);
            xStart += this.cellWidth;
        }
    },

    /**
     * Check for a collision with the rest of the snake
     *
     * @param  {integer} x Location on X axis of snake's head
     * @param  {integer} y Location on Y axis of snake's head
     * @throws {error} If a collision is found
     * @return {boolean} Hit (true) or no hit (false)
     */
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
    },

    /**
     * Check to ensure the snake hasn't tried to leave the board edges
     *
     * @param  {integer} x Location on X axis of snake head
     * @param  {integer} y Location on Y axis of snake head
     * @throws {error} If snake tries to leave the board
     */
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
    },

    /**
     * Check for a "match" (when the snake eats a block)
     *
     * @param  {integer} x Location on X axis of snake head
     * @param  {integer} y Location on Y axis of snake head
     */
    this.matchCheck = function(x, y)
    {
        if (Math.round(x) == this.randomMarker.x && Math.round(y) == this.randomMarker.y) {
            this.updateScore();
            this.snake.length++;
            this.snake.rate -= 10;

            window.clearInterval(this.interval);
            this.start();

            this.randomMarker = this.draw.random(
                this.snake.track, this.cols, this.rows, this.cellHeight, this.cellWidth
            );
        }
    },

    /**
     * Update the game score
     */
    this.updateScore = function()
    {
        this.score++;
        $('#score').html(this.score);
    },

    /**
     * Advance the game a step
     */
    this.advance = function()
    {
        var moved = this.snake.slither();

        // See if we did something wrong
        this.boundsCheck(moved.x, moved.y);
        this.collisionCheck(moved.x, moved.y);
        this.matchCheck(moved.x, moved.y);
    },

    /**
     * Start off the game - main execution function
     */
    this.start = function()
    {
        var self = this;

        // Catch our arrow keys
        $(document).keydown(function(e) {
            if (e.which == 32) {
                self.pause = (self.pause == false) ? true : false;
            }
            self.snake.changeDirection(e);
        });

        this.interval = window.setInterval(function() {
            if (self.fail == false && self.pause == false) {
                try {
                    self.advance();
                } catch(err) {
                    self.fail = true;
                    alert(err);
                }
            }
        }, this.snake.rate);
    }
};