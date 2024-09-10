import { createServer } from "../../lib/server.js";

export const request = async (path, options) => {
  const server = createServer("test/fixtures");
  const port = await new Promise((resolve) => {
    server.listen(0, () => {
      resolve(server.address().port);
    });
  });

  const url = new URL(path, `http://localhost:${port}`);
  const response = await fetch(url, options);

  server.close();
  return response;
};
