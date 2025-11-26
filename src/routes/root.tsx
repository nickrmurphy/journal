import { Book, SlidersHorizontal } from "solid-phosphor";
import type { ParentProps } from "solid-js";
import { createSignal, onMount, Show } from "solid-js";
import { NavBar, NavItem } from "@/components/layout";
import { initDatabase } from "@/database";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";

const Navigation = () => {
	return (
		<NavBar>
			<NavItem to="/" label="Journal">
				<Book />
			</NavItem>
			<NavItem to="/settings" label="Settings">
				<SlidersHorizontal />
			</NavItem>
		</NavBar>
	);
};

export const RootLayout = (props: ParentProps) => {
	useKeyboardHeight();
	const [dbReady, setDbReady] = createSignal(false);

	onMount(() => {
		initDatabase().then(() => setDbReady(true));
	});

	return (
		<Show when={dbReady()} fallback={<div>Loading database...</div>}>
			{props.children}
			<Navigation />
		</Show>
	);
};
