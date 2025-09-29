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
import App from "./app.tsx";

const storage = createFileSystemAdapter("collection");

const collectionCofig: CollectionConfig = {
	entriesCollection: createEntriesCollection(storage),
	commentsCollection: createCommentsCollection(storage),
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<CollectionContextProvider config={collectionCofig}>
			<App />
		</CollectionContextProvider>
	</StrictMode>,
);
