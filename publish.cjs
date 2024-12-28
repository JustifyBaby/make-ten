const { exec } = require("child_process");

process.stdin.setEncoding("utf-8");

const reader = require("readline").createInterface({
  input: process.stdin,
});

console.log("Enter commit message...");
reader.on("line", (commitMsg) => {
  //改行ごとに"line"イベントが発火される
  exec(
    `npm run build && git add . && git commit -m ${commitMsg} && git push && gh-pages -d dist`
  );

  return;
});
