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

            // Make the board and kick off the game
            var b = new Board(board, snake, draw);
            b.render();

            $(document).on('click', '#board', function() {
                b.reset();
                $('#score-value').html(0);
            });
        });
        </script>
        <style>
        body {
            margin: 0px;
            padding: 0px;
            font-family: verdana, arial, helvetica;
        }
        #score {
            background-color: #EEEEEE;
            padding: 5px;
        }
        #score-value {
            font-weight: bold;
        }
        #content {
            width: 400px;
            height: 90%;
            text-align: center;
            border: 1px solid #CCCCCC;
            background-color: #8E7D85;
            padding-top: 10px;
        }
        #board {
            background-color: #FFFFFF;
        }
        </style>
    </head>
    <body>
        <div id="content">
            <h2 style="color:#FFFFFF">Let's Play Snake!</h2>
            <canvas id="board" width="229" height="229"></canvas>
            <br/><br/>
            <div id="score">Score: <span id="score-value">0</span></div>
        </div>
    </body>
</html>