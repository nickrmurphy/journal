import {
	AdjustmentsHorizontalIcon,
	BookmarkIcon,
	PlusIcon,
} from "@heroicons/react/16/solid";
import { useLiveQuery } from "@tanstack/react-db";
import { entryCollection } from "./collections/entries";
import { Button } from "./components/Button";

function App() {
	const { data } = useLiveQuery((q) =>
		q
			.from({ entries: entryCollection })
			.orderBy((e) => e.entries.createdAt, "asc"),
	);

	const insert = () => {
		entryCollection.insert({
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
			content: "New entry",
		});
	};

	return (
		<main className="bg-background fixed inset-1 sm:inset-2 rounded-xl p-2">
			<h1 className="text-xl font-bold py-2">Journal</h1>
			{data.map((e) => (
				<h2 key={e.id}>Entry: {e.id}</h2>
			))}
			<nav className="bg-popover/90 border fixed bottom-3 flex justify-between gap-4 inset-x-1/4 items-center rounded-lg p-2">
				<Button type="button" variant="outline">
					<BookmarkIcon />
				</Button>
				<Button onClick={insert}>
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
