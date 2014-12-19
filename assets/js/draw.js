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