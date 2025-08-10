import {
	AdjustmentsHorizontalIcon,
	BookmarkIcon,
	PlusIcon,
} from "@heroicons/react/16/solid";
import { Button } from "./components/Button";

function App() {
	return (
		<main className="bg-background fixed inset-1 sm:inset-2 rounded-xl p-2">
			<h1>Journal</h1>
			<nav className="bg-popover/90 border fixed bottom-3 flex justify-between gap-4 inset-x-1/4 items-center rounded-lg p-2">
				<Button type="button" variant="outline">
					<BookmarkIcon />
				</Button>
				<Button>
					<PlusIcon />
				</Button>
				<Button type="button" variant="outline">
					<AdjustmentsHorizontalIcon />
				</Button>
			</nav>
		</main>
	);
}

export default App;
