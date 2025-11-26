import { serve } from "bun";
import index from "./index.html";

const server = serve({
	routes: {
		"/*": index, // Catch-all for client-side routing with wouter
	},
	development: process.env.NODE_ENV !== "production" && {
		hmr: true,
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
