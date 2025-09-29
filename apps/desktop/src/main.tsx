import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import {
	type CollectionConfig,
	CollectionContextProvider,
	createCommentsCollection,
	createEntriesCollection,
} from "@journal/core/collections";
import { createIdbStorage } from "@journal/utils/storage-adapters";

const storage = createIdbStorage();

const collectionConfig: CollectionConfig = {
	entriesCollection: createEntriesCollection(storage),
	commentsCollection: createCommentsCollection(storage),
};

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<CollectionContextProvider config={collectionConfig}>
			<App />
		</CollectionContextProvider>
	</React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
