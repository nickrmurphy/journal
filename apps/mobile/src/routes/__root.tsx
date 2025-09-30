import {
	type CollectionConfig,
	CollectionContextProvider,
	createCommentsCollection,
	createEntriesCollection,
} from "@journal/core/collections";
import { createFileSystemAdapter } from "@journal/utils/storage-adapters";
import { BookIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NavBar, NavItem } from "@/components/nav-bar";

const storage = createFileSystemAdapter("collections");

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

const RootLayout = () => (
	<CollectionContextProvider config={collectionCofig}>
		<Outlet />
		<Navigation />
		{/* <TanStackRouterDevtools /> */}
	</CollectionContextProvider>
);

export const Route = createRootRoute({ component: RootLayout });
