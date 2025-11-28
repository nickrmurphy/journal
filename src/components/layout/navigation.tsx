import { BookOpen, SlidersHorizontal } from "lucide-solid";
import type { ParentComponent } from "solid-js";
import { NavBar, NavItem } from "./nav-bar";

export const Navigation: ParentComponent = (props) => {
	return (
		<>
			{props.children}
			<NavBar>
				<NavItem to="/" label="Journal">
					<BookOpen />
				</NavItem>
				<NavItem to="/settings" label="Settings">
					<SlidersHorizontal />
				</NavItem>
			</NavBar>
		</>
	);
};
