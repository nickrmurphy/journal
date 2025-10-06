import { Hono } from "hono";
import { sign } from "hono/jwt";
import { db } from "./db";
import auth from "./routes/auth";
import collection from "./routes/collection";
import { AuthService } from "./services/auth-service";
import { CollectionService } from "./services/collection-service";
import { UserService } from "./services/user-service";

type Variables = {
	jwtPayload?: {
		sub: string;
	};
};

const app = new Hono<{ Variables: Variables }>();

const JWT_SECRET = "Fischl von Luftschloss Narfidort";

// Initialize services once at app level
const userService = new UserService(db);
const collectionService = new CollectionService(db);
const authService = new AuthService(userService);
export const services = { userService, collectionService, authService };

// Routes
app.get("/status", (c) => c.text("ok"));
app.route("/auth", auth);
app.route("/collection", collection);

export default {
	port: 3000,
	fetch: app.fetch,
};

console.log("🔥 Hono is running at http://localhost:3000");

export type Services = typeof services;
export type App = typeof app;
export { JWT_SECRET, sign };
