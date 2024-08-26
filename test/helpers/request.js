import { createServer } from "../../lib/server.js";

export const request = async (path, options) => {
  const server = createServer({ rootDir: "test/fixtures" });
  const port = await new Promise((resolve, reject) => {
    const srv = server.listen(0, () => {
      resolve(srv.address().port);
    });
    srv.on("error", reject);
  });

  const url = new URL(path, `http:localhost:${port}`);
  const response = await fetch(url, options);

  server.close();
  return response;
};
