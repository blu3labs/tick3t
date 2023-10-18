const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        const { pathname } = new URL(url);
        if (url.pathname === "/event" && req.method === "GET") {}
        if (url.pathname === "/event" && req.method === "POST") {}
        if (url.pathname === "/user" && req.method === "GET") {}
        if (url.pathname === "/user" && req.method === "POST") {}
        if (url.pathname === "/qr" && req.method === "GET") {}
        return new Response("404!");
    },
  });
  

  console.log(`Listening on http://localhost:${server.port} ...`);
  