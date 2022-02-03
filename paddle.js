class Paddle {
  constructor(places, up, down, height) {
    this.body = places;
    this.up = up;
    this.down = down;
    this.height = height;
    this.score = 0;
  }

  onKeyPress(key) {
    const { body, height } = this;
    let nextPos;
    switch (key.name) {
      case this.up:
        nextPos = [body[0][0], body[0][1] - 1];
        if (nextPos[1] >= 0) {
          //node console stuff is weird -1 is the actual 0th position
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
  }

  increase_score() {
    this.score++;
  }
}

module.exports = { Paddle };
