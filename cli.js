#!/usr/bin/env node

import process from "node:process";
import path from "node:path";
import { Command } from "commander";
import { createServer } from "./lib/server.js";

const program = new Command();

program
  .name("sserver")
  .description("A simple static file server")
  .argument("[rootDir]", "Root directory to serve files from", process.cwd())
  .option("-p, --port <port>", "Specify the port to listen on", "8080")
  .option("-b, --bind <address>", "Specify the address to bind to", "127.0.0.1")
  .helpOption("-h, --help", "Show help");

program.parse();

const options = program.opts();
const rootDir = path.resolve(program.processedArgs[0]);
const port = parseInt(options.port, 10);
const address = options.bind;

const server = createServer(rootDir);
server.listen(port, address, () => {
  console.log(`Server listening on http://${address}:${port}`);
  console.log(`Serving files from ${rootDir}`);
});
