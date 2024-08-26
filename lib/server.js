import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { generateETag } from "./etag.js";
import { getMimeType } from "./mime-type.js";
import { STATUS_CODES } from "./status-codes.js";

const reqLogger = (req, res) => {
  const start = Date.now();
  res.on("close", () => {
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;
    const contentLength = res.getHeader("content-length");
    const duration = Date.now() - start;

    console.log(
      `${method} ${url} ${statusCode} - ${contentLength} - ${duration} ms`,
    );
  });
};

const sendStatus = (res, statusCode) => {
  const message = http.STATUS_CODES[statusCode];

  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Length", message.length);
  res.end(message);
};

export const createServer = (config) => {
  const rootDir = path.resolve(config.rootDir);

  return http.createServer((req, res) => {
    reqLogger(req, res);

    if (req.method !== "GET") {
      sendStatus(res, STATUS_CODES.METHOD_NOT_ALLOWED);
      return;
    }

    const reqPath = req.url.replace(/\?.*/, "");
    const filePath = path.join(rootDir, reqPath);

    if (!filePath.startsWith(rootDir)) {
      sendStatus(res, STATUS_CODES.FORBIDDEN);
      return;
    }

    const fileStat = fs.statSync(filePath, {
      throwIfNoEntry: false,
    });

    if (!fileStat || fileStat.isDirectory()) {
      sendStatus(res, STATUS_CODES.NOT_FOUND);
      return;
    }

    const etag = generateETag(fileStat);
    const ifNoneMatch = req.headers["if-none-match"];

    if (ifNoneMatch === etag) {
      res.statusCode = STATUS_CODES.NOT_MODIFIED;
      res.end();
      return;
    }

    const readStream = fs.createReadStream(filePath);
    const mimeType = getMimeType(filePath) ?? "application/octet-stream";

    res.statusCode = STATUS_CODES.OK;
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", fileStat.size);
    res.setHeader("ETag", etag);
    readStream.pipe(res);
  });
};
