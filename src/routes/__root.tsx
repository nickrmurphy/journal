import { BookIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NavBar, NavItem } from "@/components/nav-bar";
import { initDatabase } from "@/database";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";

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
	const [dbReady, setDbReady] = useState(false);

	useEffect(() => {
		initDatabase().then(() => setDbReady(true));
	}, []);

	if (!dbReady) {
		return <div>Loading database...</div>;
	}

	return (
		<>
			<Outlet />
			<Navigation />
			{/* <TanStackRouterDevtools /> */}
		</>
	);
};

export const Route = createRootRoute({ component: RootLayout });
