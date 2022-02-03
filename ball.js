const { isArrayItemExists } = require("./helpers");

let direction_array = [1, -1];

class Ball {
  constructor(height) {
    this.height = height; //height of screen
    this.position = [
      Math.floor(Math.random() * (40 - 20) + 20),
      Math.floor(Math.random() * (10 - 5) + 5),
    ]; //for math.random within two values *(max-min)+min
    this.direction = [
      direction_array[Math.floor(Math.random() * direction_array.length)],
      direction_array[Math.floor(Math.random() * direction_array.length)],
    ]; //[0] determines left/right [1] determines up/down: negative is left/up, pos is right/down
  }

  update(paddle, opponentPaddle) {
    if (
      this.position[1] + this.direction[1] >= this.height ||
      this.position[1] + this.direction[1] <= -1
    ) {
      //logic for side bounce
      this.direction[1] *= -1;
    }
    if (
      this.position[0] + this.direction[0] >= 58 ||
      this.position[0] + this.direction[0] <= 1
    ) {
      //logic for scoring
      //logic for paddle bounce
      if (
        isArrayItemExists(paddle.body, [
          this.position[0] + this.direction[0],
          this.position[1] + this.direction[1],
        ]) ||
        isArrayItemExists(opponentPaddle.body, [
          this.position[0] + this.direction[0],
          this.position[1] + this.direction[1],
        ])
      ) {
        this.direction[0] *= -1;
      } else if (this.position[0] >= 58) {
        paddle.increase_score();
        this.reset();
      } else if (this.position[0] <= 1) {
        opponentPaddle.increase_score();
        //this.reset();
      }
    }
    this.position = [
      this.position[0] + this.direction[0],
      this.position[1] + this.direction[1],
    ];
  }

  reset() {
    //reset ball to another random position/direction
    this.position = [
      Math.floor(Math.random() * (40 - 20) + 20),
      Math.floor(Math.random() * (10 - 5) + 5),
    ];
    this.direction = [
      direction_array[Math.floor(Math.random() * direction_array.length)],
      direction_array[Math.floor(Math.random() * direction_array.length)],
    ];
  }
}

module.exports = { Ball };
