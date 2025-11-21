import { createContext, type ReactNode, useContext } from "react";
import type { createCommentsCollection } from "./comments";
import type { createEntriesCollection } from "./entries";

export type CollectionConfig = {
	entriesCollection: ReturnType<typeof createEntriesCollection>;
	commentsCollection: ReturnType<typeof createCommentsCollection>;
};

const CollectionContext = createContext<CollectionConfig | null>(null);

export const CollectionContextProvider = (props: {
	config: Required<CollectionConfig>;
	children: ReactNode;
}) => (
	<CollectionContext.Provider value={props.config}>
		{props.children}
	</CollectionContext.Provider>
);

export const useCollections = (): CollectionConfig => {
	const context = useContext(CollectionContext);

	if (!context)
		throw Error("useCollections must be used within CollectionContextProvider");

	return context;
};
