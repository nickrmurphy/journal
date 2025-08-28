import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RepoProvider } from "./components/RepoContext.tsx";

// biome-ignore lint/style/noNonNullAssertion: <root setup>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RepoProvider>
			<App />
		</RepoProvider>
	</StrictMode>,
);
