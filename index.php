<html>
    <head>
        <script type="text/javascript" src="/assets/js/jquery-1.11.1.min.js"></script>
        <script type="text/javascript" src="/assets/js/board.js"></script>
        <script type="text/javascript">
        $(function() {

            var board = document.getElementById('board');
            var b = new Board(board);
            b.render();

            setInterval(function() {
                if (b.fail == false && b.pause == false) {
                    b.slither();
                }
            }, b.rate);

            // Catch our arrow keys
            $(document).keydown(function(e) {
                if (e.which == 32) {
                    b.pause = (b.pause == false) ? true : false;
                }
                b.changeDirection(e);
            });
        });
        </script>
    </head>
    <body>
        <canvas id="board" width="110" height="110"></canvas>
        <div id="score"></div>
    </body>
</html>