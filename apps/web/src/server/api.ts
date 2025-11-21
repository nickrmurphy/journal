import { Hono } from "hono";
import auth from "./routes/auth";
import collection from "./routes/collection";

const api = new Hono().basePath("/api");

// Health check
api.get("/status", (c) => c.text("ok"));

// Routes
api.route("/auth", auth);
api.route("/collection", collection);

export default api;
