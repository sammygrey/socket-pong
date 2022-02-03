var readline = require("readline");

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on("keypress", (_, key) => {
  if (key) {
    console.log(key);
    if (key.ctrl) {
      if (key.name == "c") {
        process.exit();
      }
    }
  }
});
