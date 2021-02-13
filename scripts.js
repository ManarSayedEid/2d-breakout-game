var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
ctx.lineWidth = 3;

////Game Over Div 
let gameFinished = document.getElementById('gameOver');
/// congrats
let congrats = document.getElementById('congrats');


var hitBlocks = new Audio();
hitBlocks.src = "audio/hitBlock.wav";

var paddle_wall_hit = new Audio();
paddle_wall_hit.src = "audio/wallhit.mp3";

var paddlehit = new Audio();
paddlehit.src = "audio/paddlehit.wav";

var end = new Audio();
end.src = "audio/gameOver.wav";

var levelUp = new Audio();
levelUp.src = "audio/levelUp.wav";

var out = new Audio();
out.src = "audio/out.mp3";

var win = new Audio();
win.src = "audio/win.wav";

//restart
const restart = document.getElementById("restart");
restart.addEventListener("click", function () {
    location.reload();
})




window.addEventListener('load', () => {

    canvas.height = window.innerHeight / 1.04;
    canvas.width = window.innerWidth / 1.04;


    function init() {
        var img = document.getElementById('bg');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    ////////////////////////////////Try Local Storage Stuff ////

    console.log(typeof (localStorage.getItem("level")));


    //other important variables
    var score = parseInt(localStorage.getItem("score"));
    var block_w = 80;
    var block_h = 25;
    var life = parseInt(localStorage.getItem("life"));
    var Maxlevels = parseInt(localStorage.getItem("maxlevels"));
    var level = parseInt(localStorage.getItem("level"));
    // var lastScore;
    var gameOver = false;


    // for ball 
    var ball_radius = 10;
    var ball_speed = parseInt(localStorage.getItem("ballspeed"));     //////// Local Storage Edit 
    console.log(ball_speed)

    // creating the paddle 
    var paddle_height = 20;
    var paddle_width = 200;

    //paddle obj
    var paddle = {
        x: (canvas.width - paddle_width) / 2,
        y: canvas.height - paddle_height - 20
    }

    //ball obj
    var ball = {
        x_velocity: (Math.random() > 0.5) ? 5 : -5, // to make ball randomly go left or right
        y_velocity: -5,
        x: canvas.width / 2,
        y: paddle.y + ball_radius,
    }


    // object have information about each press
    var keyDetect = {
        right: false,
        left: false
    }

    // draw paddle
    function drawpaddle() {
        ctx.beginPath();
        ctx.fillStyle = "#162D3F";
        ctx.fillRect(paddle.x, paddle.y, paddle_width, paddle_height);
        ctx.fill()
        ctx.closePath();
    }

    // function constructor to make many Rectangle blocks
    function Rect(x, y) {
        this.x = x;
        this.y = y;
        this.status = true; // status of the block ( exist or broken)
        this.draw = function () {
            ctx.beginPath();
            ctx.fillStyle = "#162D3F";
            ctx.fillRect(this.x, this.y, block_w, block_h);
            ctx.fill()
            ctx.closePath();
        }
    }

    var blocks = [];   //////////// LOCAL SOTRGE EDITING ////////////

    // let Myblocks = JSON.parse(localStorage.getItem("blocks")) 
    // console.log(Myblocks)

    function createBlocks() {


        for (var x = 50; x < canvas.width - 100; x += 100) {
            blocks.push(new Rect(x, 50));
            blocks.push(new Rect(x, 100));
            blocks.push(new Rect(x, 150));
            // levelOneBlocks = blocks.length*10;

            if (level === 2) {
                blocks.push(new Rect(x, 200));
                // levelTwoBlocks = blocks.length*10;
            }

            if (level === 3) {
                blocks.push(new Rect(x, 200));
                blocks.push(new Rect(x, 250));
            }

        }
    }
    createBlocks()
    // console.log(blocks);

    function drawBlocks() {
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].status) {
                blocks[i].draw();
            }
        }

    }

    // draw ball
    function drawBall() {
        ctx.beginPath();
        ctx.fillStyle = "#162D3F";
        ctx.arc(ball.x, ball.y, ball_radius, 0, 2 * Math.PI);
        ctx.strokeStyle = "#F3D2D6";
        ctx.stroke();
        ctx.fill()
        ctx.closePath();
    }

    function updateBall() {
        drawBall();
        // detect the left and right wall (x axis)
        if ((ball.x + ball_radius) > canvas.width || (ball.x - ball_radius) < 0) {
            paddle_wall_hit.play();
            ball.x_velocity = -ball.x_velocity;
        }


        // detect above wall
        if ((ball.y - ball_radius) < 0) {
            paddle_wall_hit.play();
            ball.y_velocity = -ball.y_velocity;
        }



        // detect paddle
        if (ball.x > paddle.x && ball.x < paddle.x + paddle_width
            && ball.y > paddle.y) {
            paddlehit.play();
            // five line of PURE PHYSICS
            var collidePoint = ball.x - (paddle.x + paddle_width / 2);
            collidePoint = collidePoint / (paddle_width / 2);
            var angle = collidePoint * Math.PI / 3;
            ball.x_velocity = ball_speed * Math.sin(angle);
            ball.y_velocity = - ball_speed * Math.cos(angle);
            ////////////////////////////////////////

        }


        // detect below wall
        if ((ball.y + ball_radius) > canvas.height) {
            if (life > 1) {
                out.play();
                life--;
                localStorage.setItem("life", life);       //////////// Local Storage Edited
                resetTosame();
            }
            else {
                gameOver = true;
                gameFinished.style.display = "block";
                end.play();
            }

        }

        ball.x += ball.x_velocity;
        ball.y += ball.y_velocity;
    }

    function movePaddle() {
        if (keyDetect.right) {
            paddle.x += 10;
            //prevent paddle from getting out of the screen from left
            if (paddle.x + paddle_width > canvas.width) {
                paddle.x -= 10;
                // paddleX = canvas.width - paddleWidth;
            }
        }

        if (keyDetect.left) {
            paddle.x -= 10;
            //prevent paddle from getting out of the screen from left
            if (paddle.x <= 0) {
                paddle.x += 10;
                // paddle_X = 0;
            }
        }
    }

    // when press detect which key
    window.addEventListener('keydown', function (event) {

        if (event.which === 39)
            keyDetect.right = true;

        if (event.which === 37)
            keyDetect.left = true;
    })

    // after pressing key change its boolean to false
    window.addEventListener('keyup', function (event) {
        // console.log(event.key);
        if (event.which === 39)
            keyDetect.right = false;

        if (event.which === 37)
            keyDetect.left = false;
    })

    // store score
    function getScore() {
        var img = document.getElementById('score');
        ctx.drawImage(img, 15, 17, 20, 20);
        ctx.fillStyle = "black";
        ctx.font = "20px monospace";
        ctx.fillText(score, 40, 35);
    }

    function getLevel() {
        var img = document.getElementById('level');
        ctx.drawImage(img, 150, 17, 20, 20);
        ctx.fillStyle = "black";
        ctx.font = "20px monospace";
        ctx.fillText(level, 180, 35);
    }

    function getLife() {
        var img = document.getElementById('life');
        ctx.drawImage(img, 270, 17, 20, 20);
        ctx.fillStyle = "black";
        ctx.font = "20px monospace";
        ctx.fillText(life, 300, 35);
    }

    // blocks and ball collision detect
    function circleRect(cx, cy, radius, rx, ry) {
        var rw = 80;
        var rh = 20;
        // temporary variables to set edges for testing
        var testX = cx;
        var testY = cy;

        // which edge is closest?
        if (cx < rx) testX = rx;      // test left edge
        else if (cx > rx + rw) testX = rx + rw;   // right edge
        if (cy < ry) testY = ry;      // top edge
        else if (cy > ry + rh) testY = ry + rh;   // bottom edge

        // get distance from closest edges
        var distX = cx - testX;
        var distY = cy - testY;
        var distance = Math.sqrt((distX * distX) + (distY * distY));

        // if the distance is less than the radius, collision!
        if (distance <= radius) {
            return true;
        }
        return false;
    }

    // create new blocks depending on level 
    // reset the ball to its initial status
    // increase ball speed to be more hard
    function resetToNewLevel() {
        createBlocks();
        ball.x_velocity = (Math.random() > 0.5) ? 5 : -5; // to make ball randomly go left or right
        ball.y_velocity = -5;
        ball.x = canvas.width / 2;
        ball.y = paddle.y + ball_radius;

        ball_speed += 2;
        localStorage.setItem("ballspeed", ball_speed);
    }

    // create same blocks
    // reset the ball to its initial status
    function resetTosame() {
        ball.x_velocity = (Math.random() > 0.5) ? 5 : -5; // to make ball randomly go left or right
        ball.y_velocity = -5;
        ball.x = canvas.width / 2;
        ball.y = paddle.y + ball_radius;
    }



    // Main function that init the game
    function animate() {

        if (!gameOver) {
            requestAnimationFrame(animate);
        } else {



        }



        init();
        updateBall();
        drawpaddle();
        movePaddle();
        drawBlocks();
        getScore();
        getLevel();
        getLife();


        // every frame detect if any collision between blocks and ball
        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].status === true) {
                var hit = circleRect(ball.x, ball.y, ball_radius, blocks[i].x, blocks[i].y);
                if (hit) {
                    hitBlocks.play();
                    blocks[i].status = false;
                    // change direction of the ball
                    ball.y_velocity = -ball.y_velocity;
                    // increment score by 10
                    score += 10;
                    localStorage.setItem("score", score); /////////////////////// EDITED LOCAL SOTRAGE
                    if (score === blocks.length * 10) {
                        if (level < Maxlevels) {
                            levelUp.play();
                            level++;
                            localStorage.setItem("level", level);  ///////////// EDITED LOCAL STORAGE
                            resetToNewLevel();
                        }
                        else {
                            gameOver = true;
                            win.play();
                            congrats.style.display = "block";
                            // alert("YOU WIN, CONGRATULATIONS!");
                            // restart.style.display = "block";
                            //need some changes
                        }
                    }
                }
            }
        }
    }
    animate();

})
