var Draw = function(context)
{
    this.context = context;

    /**
     * Draw a cell
     *
     * @param  {integer} x X axis location to draw
     * @param  {integer} y Y axis location to draw
     * @param  {integer} width Width of cell
     * @param  {integer} height Height of cell
     * @param  {string} color Color to outline with
     */
    this.cell = function(x, y, width, height, color)
    {
        this.context.strokeStyle = '#e0e0e0';
        this.context.strokeRect(x, y, width, height);
    },

    /**
     * Draw a marker (colored cell)
     *
     * @param  {integer} x X axis location to draw
     * @param  {integer} y Y axis location to draw
     * @param  {integer} width Width of the cell
     * @param  {integer} height Height of the cell
     * @param  {string} color Color to fill the cell with
     */
    this.marker = function(x, y, width, height, color)
    {
        if (typeof color == 'undefined') {
            color = '#000000';
        }
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    },

    /**
     * "Remove" a marker (redraws, just without color)
     *
     * @param  {integer} x X axis location to draw
     * @param  {integer} y Y axis location to draw
     * @param  {integer} width Width of cell
     * @param  {integer} height Height of cell
     */
    this.removeMarker = function(x, y, width, height)
    {
        this.context.fillStyle = '#FFFFFF';
        this.context.fillRect(x, y, width, width);
    },

    /**
     * Draw a random cell (for the snake to "eat")
     *
     * @param  {[type]} data Data set representing the current snake
     * @param  {integer} cols Number of columns
     * @param  {integer} rows Number of rows
     * @param  {integer} width Width of the cell
     * @param  {integer} height Heigth of the cell
     * @return {object} Cell object X/Y location
     */
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
    },

    this.clearBoard = function(height, width)
    {
        this.context.clearRect(0, 0, height, width);
    }
};