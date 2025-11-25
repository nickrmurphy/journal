import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Override crypto.randomUUID if not available
(() => {
        if (!window.crypto.randomUUID) {
                window.crypto.randomUUID = () => {
                        const bytes = crypto.getRandomValues(new Uint8Array(16));
                        bytes[6] = (bytes[6] & 0x0f) | 0x40;
                        bytes[8] = (bytes[8] & 0x3f) | 0x80;

                        const segments = [
                                bytes.subarray(0, 4),
                                bytes.subarray(4, 6),
                                bytes.subarray(6, 8),
                                bytes.subarray(8, 10),
                                bytes.subarray(10, 16),
                        ];

                        const toHex = (segment: Uint8Array) =>
                                Array.from(segment)
                                        .map((byte) => byte.toString(16).padStart(2, "0"))
                                        .join("");

                        return segments.map(toHex).join("-") as `${string}-${string}-${string}-${string}-${string}`;
                };
        }
})();

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>,
	);
}
