#!/usr/bin/env node

import { createServer } from "./lib/server.js";

const showHelp = () => {
  console.log(`
Usage: sserver [options]

Options:
  -p, --port <port>          Specify the port to listen on (default: 8080)
  -b, --bind <address>       Specify the address to bind to (default: 0.0.0.0)
  -d, --dir <path>           Specify the root directory (default: public)
  -h, --help                 Show this help message
`);
  process.exit(0);
};

let port = 8080;
let address = "0.0.0.0";
let rootDir = "public";

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];

  switch (arg) {
    case "-p":
    case "--port":
      port = parseInt(process.argv[++i], 10);
      break;
    case "-b":
    case "--bind":
      address = process.argv[++i];
      break;
    case "-d":
    case "--dir":
      rootDir = process.argv[++i];
      break;
    case "-h":
    case "--help":
      showHelp();
      break;
    default:
      console.log(`Unknown option: ${arg}`);
      showHelp();
      break;
  }
}

const server = createServer({ rootDir });
server.listen(port, address, () => {
  console.log(`Server listening on ${address}:${port}`);
});
