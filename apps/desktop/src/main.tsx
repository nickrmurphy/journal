import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Tooltip } from "@base-ui-components/react/tooltip";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Tooltip.Provider>
			<App />
		</Tooltip.Provider>
	</React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
