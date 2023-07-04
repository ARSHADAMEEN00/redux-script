const fs = require("fs");
const path = require("path");

const sourcePath = path.resolve(__dirname, "./postinstall.js");
const targetPath = path.resolve(process.cwd(), "script.js");

fs.copyFile(sourcePath, targetPath, (err) => {
  if (err) {
    console.error("Failed to copy script.js:", err);
  } else {
    console.log("script.js copied successfully!");
  }
});
