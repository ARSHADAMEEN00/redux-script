#!/usr/bin/env node

const generateFiles = require("./generate").generateFiles;

const titlesFromCommand = process.argv[3];
const modelName = titlesFromCommand?.split(",");

if (process.argv[2] === undefined) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Invalid command. Use 'all' to run both functions, 'api' to run asyncApis, or 'store' to run reduxStore."
  );

  process.exit(1);
}

if (!titlesFromCommand) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    "Please provide model names for file generation."
  );

  process.exit(1);
}

if (process.argv.length > 2) {
  generateFiles(process.argv[2], modelName);
} else {
  console.error("Please provide a model name as a command line argument.");
  process.exit(1);
}
