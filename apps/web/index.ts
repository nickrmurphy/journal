import index from "./index.html";
import api from "./src/server/api";

Bun.serve({
  routes: {
    "/": index,
    "/api/*": api.fetch,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log("Server running at http://localhost:3000");
