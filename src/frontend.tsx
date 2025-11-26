import { render } from "solid-js/web";
import "./styles.css";
import { AppRouter } from "./router";

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
	render(() => <AppRouter />, rootElement);
}
