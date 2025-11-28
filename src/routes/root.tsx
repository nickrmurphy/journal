import { BookOpen, SlidersHorizontal } from "lucide-solid";
import type { ParentProps } from "solid-js";
import { createEffect, createSignal, Show } from "solid-js";
import { NavBar, NavItem } from "@/components/layout";
import { initDatabase } from "@/database";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";

const Navigation = () => {
	return (
		<NavBar>
			<NavItem to="/" label="Journal">
				<BookOpen />
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

	createEffect(() => {
		initDatabase().then(() => setDbReady(true));
	});

	return (
		<Show when={dbReady()} fallback={<div>Loading database...</div>}>
			{props.children}
			<Navigation />
		</Show>
	);
};
