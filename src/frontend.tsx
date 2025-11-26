import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Router } from "wouter";
import "./styles.css";
import { AppRouter } from "./router";

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<Router>
				<AppRouter />
			</Router>
		</StrictMode>,
	);
}
