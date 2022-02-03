#!/usr/bin/env node
const { textColors, bgColors } = require("./colors");
const { isArrayItemExists } = require("./helpers");
const { Ball } = require("./ball");
const { Paddle } = require("./paddle");

var readline = require("readline");

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

const width = 60; //display width its actually more like this - 2
const height = 15; //display height
let menu = false;
let game = false;
let paddle, ball, opponentPaddle;
let toDraw = [];
let fps = 7;
let c;
let settings = {
  playerUp: "w",
  playerDown: "s",
  opponentUp: "up",
  opponentDown: "down",
  textColor: "white",
  bgColor: "black",
};
let menuIndex = 0;
let menuOptions = [
  "Play Single player",
  "Play Multiplayer",
  "Settings",
  "Exit",
];

function drawMenu() {
  if (menu == true) {
    console.clear();
    console.log(
      "                      __              __\n                     /\\ \\            /\\ \\__\n  ____    ___     ___\\ \\ \\/‾\\      __\\ \\  _\\          _____     ___     ___      __\n /  __\\  / __ \\  / ___\\ \\   <    / __ \\ \\ \\/  _______/\\  __ \\  / __ \\  / __ \\  / __ \\\n/\\__   \\/\\ \\_\\ \\/\\ \\__/\\ \\ \\\\ \\ /\\  __/\\ \\ \\_/\\______\\ \\ \\_\\ \\/\\ \\_\\ \\/\\ \\/\\ \\/\\ \\_\\ \\\n\\/\\____/\\ \\____/\\ \\____\\\\ \\_\\\\_\\\\ \\____\\\\ \\__\\/______/\\ \\  __/\\ \\____/\\ \\_\\ \\_\\ \\____ \\\n \\/___/  \\/___/  \\/____/ \\/_//_/ \\/____/ \\/__/         \\ \\ \\/  \\/___/  \\/_/\\/_/\\/____\\ \\\n                                                        \\ \\_\\                    /\\____/\n                                                         \\/_/                    \\/___/"
    );
    for (option of menuOptions) {
      if (option == menuOptions[menuIndex]) {
        //something here to inverse bg and text
        console.log(
          `${textColors[settings.bgColor]}${
            bgColors[settings.textColor]
          }>${option}`
        );
      } else {
        console.log(
          `${textColors[settings.textColor]}${
            bgColors[settings.bgColor]
          } ${option}`
        );
      }
    }
    console.log(
      `${bgColors[settings.bgColor]}${textColors[settings.textColor]}`
    );
  }
}

function drawGame() {
  if (game) {
    console.clear();
    console.log(" ---------------------------------------------------------- ");
    console.log(
      `  Player 1: ${paddle.score}                                  Player 2: ${opponentPaddle.score}`
    );
    console.log(" ---------------------------------------------------------- ");
    for (let i = 0; i < height; i++) {
      let l = "";
      for (let i2 = 0; i2 < width; i2++) {
        if (isArrayItemExists(toDraw, [i2, i])) {
          if (i2 == ball.position[0] && i == ball.position[1]) {
            l += "\x1b[37m●";
          }
          if (
            isArrayItemExists(paddle.body, [i2, i]) ||
            isArrayItemExists(opponentPaddle.body, [i2, i])
          ) {
            l += "\x1b[37m|";
          }
        } else {
          l += "\x1b[30m○";
        }
      }
      console.log(l);
    }
    console.log(
      "\x1b[37m ---------------------------------------------------------- "
    );
    console.log("  r to restart                            ctrl + c to quit ");
    console.log(" ---------------------------------------------------------- ");
  }
}

function update() {
  toDraw = [];
  if (menu) {
    drawMenu();
  } else if (game) {
    ball.update(paddle, opponentPaddle);
    toDraw = [...toDraw, ...paddle.body, ...opponentPaddle.body, ball.position];
    drawGame();
  }
  if (c) clearInterval(c);

  c = setInterval(update, 1000 / fps);
}

function start() {
  menu = true;

  if (c) clearInterval(c);

  c = setInterval(update, 1000 / fps);
}

function gameStart() {
  game = true;
  places = [
    [1, 6],
    [1, 7],
    [1, 8],
  ];
  opponentPlaces = [
    [58, 6],
    [58, 7],
    [58, 8],
  ];
  paddle = new Paddle(places, settings.playerUp, settings.playerDown, height);
  ball = new Ball(height);
  opponentPaddle = new Paddle(
    opponentPlaces,
    settings.opponentUp,
    settings.opponentDown,
    height
  );

  if (c) clearInterval(c);

  c = setInterval(update, 1000 / fps);
}

process.stdin.on("keypress", (_, key) => {
  if (key) {
    if (key.ctrl && key.name == "c") {
      process.exit();
    }
    if (menu) {
      switch (key.name) {
        case settings.playerUp:
        case settings.opponentUp:
          menuIndex -= 1;
          if (menuIndex < 0) {
            menuIndex += 1;
          }
          break;
        case settings.playerDown:
        case settings.opponentDown:
          menuIndex += 1;
          if (menuIndex == menuOptions.length) {
            menuIndex -= 1;
          }
          break;
        case "return":
          if (menuIndex == 0) {
            menu = false;
            gameStart();
          }
          console.log(key);
      }
    } else if (game) {
      switch (key.name) {
        case "r":
          start();
        case settings.playerUp:
        case settings.playerDown:
          paddle.onKeyPress(key);
        case settings.opponentUp:
        case settings.opponentDown:
          opponentPaddle.onKeyPress(key);
      }
    }
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

start();
