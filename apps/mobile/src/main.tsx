import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
	type CollectionConfig,
	CollectionContextProvider,
	createCommentsCollection,
	createEntriesCollection,
} from "@journal/core/collections";
import { createFileSystemAdapter } from "@journal/utils/storage-adapters";
import { v4 } from "uuid";
import App from "./app.tsx";

const storage = createFileSystemAdapter("collections");

const collectionCofig: CollectionConfig = {
	entriesCollection: createEntriesCollection(storage),
	commentsCollection: createCommentsCollection(storage),
};

// Override crypto.randomUUID if not available in Capacitor
(() => {
	if (!window.crypto.randomUUID) {
		window.crypto.randomUUID = () => {
			return v4() as `${string}-${string}-${string}-${string}-${string}`;
		};
	}
})();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CollectionContextProvider config={collectionCofig}>
			<App />
		</CollectionContextProvider>
	</StrictMode>,
);
