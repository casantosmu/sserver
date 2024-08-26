import { test } from "node:test";
import { strictEqual } from "node:assert";
import { request } from "./helpers/request.js";

test("GET /file.txt should return 200", async () => {
  const response = await request("/file.txt");

  strictEqual(response.status, 200);
  strictEqual(response.headers.get("content-type"), "text/plain");
  strictEqual(response.headers.get("content-length"), "40");
});

test("GET /non-file.txt should return 404", async () => {
  const response = await request("/non-file.txt");

  strictEqual(response.status, 404);
});

test("POST /file.txt should return 405", async () => {
  const response = await request("/file.txt", {
    method: "POST",
  });

  strictEqual(response.status, 405);
});

test("GET /file.txt with ETag should return 304 if unchanged", async () => {
  const initialResponse = await request("/file.txt");
  const etag = initialResponse.headers.get("etag");

  const response = await request("/file.txt", {
    headers: {
      "If-None-Match": etag,
    },
  });

  strictEqual(response.status, 304);
});
