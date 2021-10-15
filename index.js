var readline = require("readline");

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

const width = 60; //display width
const height = 15; //display height
let paddle, ball, opponent_paddle;
let toDraw = [];
let fps = 10;
let c;

function draw() {
  console.clear();
  console.log(" --------------------------------------------------------- ");
  console.log(
    `  Player 1: ${paddle.score}                                 Player 2: ${opponent_paddle.score}`
  );
  console.log(" --------------------------------------------------------- ");
  for (let i = 0; i < height; i++) {
    let l = "";
    for (let i2 = 0; i2 < width; i2++) {
      if (isArrayItemExists(toDraw, [i2, i])) {
        l += "\x1b[37m |";
      } else {
        l += "\x1b[30m ○";
      }
    }
    console.log(l);
  }
  console.log(
    "\x1b[37m --------------------------------------------------------- "
  );
  console.log("  r to restart                           ctrl + c to quit ");
  console.log(" --------------------------------------------------------- ");
}

function update() {
  toDraw = [];
  paddle.draw();
  opponent_paddle.draw();
  //ball.update();
  draw();
}

function start() {
  places = [
    [0, 10],
    [0, 11],
    [0, 12],
  ];
  opponent_places = [
    [28, 10],
    [28, 11],
    [28, 12],
  ];
  paddle = new Paddle(places, "w", "s");
  ball = new Ball();
  opponent_paddle = new Paddle(opponent_places, "up", "down");

  if (c) clearInterval(c);

  c = setInterval(update, 1000 / fps);
}

class Paddle {
  constructor(places, up, down) {
    this.body = places;
    this.up = up;
    this.down = down;
    this.score = 0;
  }

  onKeyPress(key) {
    const { body } = this;
    let nextPos;
    switch (key.name) {
      case this.up:
        nextPos = [body[0][0], body[0][1] - 1];
        if (nextPos[1] > -1) {
          body.pop();
          body.splice(0, 0, nextPos);
        }
        break;
      case this.down:
        nextPos = [body[0][0], body[2][1] + 1];
        if (nextPos[1] < height) {
          body.shift();
          body.splice(2, 0, nextPos);
        }
        break;
    }

    paddle.draw();
  }

  draw() {
    const { body } = this;
    toDraw = [...toDraw, ...this.body];
  }
}

class Ball {
  constructor() {
    this.position = [0, 0];
    this.direction = [0, 0];
  }

  update() {
    this.position[0] = Math.round(Math.random() * (width - 1));
    this.position[1] = Math.round(Math.random() * (height - 1));
  }

  onCapture() {
    this.setNewPosition();
  }

  update() {
    this.draw();
  }

  draw() {
    toDraw = [...toDraw, this.position];
  }
}

process.stdin.on("keypress", (ch, key) => {
  if (key && key.ctrl && key.name === "c") {
    process.exit();
  } else if (key.name === "r") {
    start();
    return;
  } else if (key.name === "w" || key.name === "s") {
    paddle.onKeyPress(key);
  } else if (key.name === "up" || key.name === "down") {
    opponent_paddle.onKeyPress(key);
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

function isArrayItemExists(array, item) {
  for (var i = 0; i < array.length; i++) {
    if (JSON.stringify(array[i]) == JSON.stringify(item)) {
      return true;
    }
  }
  return false;
}

start();
