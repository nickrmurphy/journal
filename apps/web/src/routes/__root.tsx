import {
	type CollectionConfig,
	CollectionContextProvider,
	createCommentsCollection,
	createEntriesCollection,
} from "@journal/core/collections";
import { createIdbStorage } from "@journal/utils/storage-adapters/idb-adapter";
import { BookIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NavBar, NavItem } from "@/components/nav-bar";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";

const storage = createIdbStorage();

const collectionCofig: CollectionConfig = {
	entriesCollection: createEntriesCollection(storage),
	commentsCollection: createCommentsCollection(storage),
};

const Navigation = () => {
	return (
		<NavBar>
			<NavItem to="/" label="Journal" viewTransition>
				<BookIcon />
			</NavItem>
			<NavItem to="/settings" label="Settings" viewTransition>
				<SlidersHorizontalIcon />
			</NavItem>
		</NavBar>
	);
};

const RootLayout = () => {
	useKeyboardHeight();

	return (
		<CollectionContextProvider config={collectionCofig}>
			<Outlet />
			<Navigation />
			{/* <TanStackRouterDevtools /> */}
		</CollectionContextProvider>
	);
};

export const Route = createRootRoute({ component: RootLayout });
