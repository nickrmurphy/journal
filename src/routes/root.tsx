import { BookIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { NavBar, NavItem } from "@/components/layout";
import { initDatabase } from "@/database";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";

const Navigation = () => {
	return (
		<NavBar>
			<NavItem to="/" label="Journal">
				<BookIcon />
			</NavItem>
			<NavItem to="/settings" label="Settings">
				<SlidersHorizontalIcon />
			</NavItem>
		</NavBar>
	);
};

export const RootLayout = ({ children }: PropsWithChildren) => {
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
			{children}
			<Navigation />
		</>
	);
};
