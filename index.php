<html>
    <head>
        <script type="text/javascript" src="/assets/js/jquery-1.11.1.min.js"></script>

        <script type="text/javascript" src="/assets/js/board.js"></script>
        <script type="text/javascript" src="/assets/js/draw.js"></script>
        <script type="text/javascript" src="/assets/js/snake.js"></script>

        <script type="text/javascript">
        $(function() {

            var board = document.getElementById('board');
            var context = board.getContext('2d');

            var draw = new Draw(context);
            var snake = new Snake(draw);

            var b = new Board(board, snake, draw);
            b.render();
        });
        </script>
    </head>
    <body>
        <canvas id="board" width="110" height="110"></canvas>
        <div id="score"></div>
    </body>
</html>