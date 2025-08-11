import {
	AdjustmentsHorizontalIcon,
	BookmarkIcon,
} from "@heroicons/react/16/solid";
import { useLiveQuery } from "@tanstack/react-db";
import { entryCollection } from "./collections/entries";
import { Button } from "./components/Button";
import { CreateEntryDialog } from "./components/CreateEntryDialog";
import { formatEntryDate } from "./utils/formatDate";

function App() {
	const { data } = useLiveQuery((q) =>
		q
			.from({ entries: entryCollection })
			.orderBy((e) => e.entries.createdAt, "asc"),
	);

	return (
		<main className="bg-background w-[calc(100%-theme(spacing.4))] flex flex-col rounded-2xl flex-1 m-auto min-h-[calc(100vh-theme(spacing.4))] my-2 p-2 overflow-auto">
			<h1 className="text-xl font-bold p-2 mb-4">Welcome back</h1>
			<section className="divide-y">
				{data.map((e) => (
					<article
						key={e.id}
						className="text-card-foreground px-2 py-3 space-y-1"
					>
						<h2 className="text-xs text-muted-foreground">
							{formatEntryDate(e.createdAt)}
						</h2>
						<p>{e.content}</p>
					</article>
				))}
			</section>
			<nav className="bg-popover/90 border fixed bottom-[calc(var(--safe-bottom)+(var(--spacing)*4))] flex justify-between gap-4 inset-x-1/4 items-center rounded-lg p-2 backdrop-blur-xs">
				<Button type="button" variant="outline">
					<BookmarkIcon />
				</Button>
				<CreateEntryDialog />
				<Button type="button" variant="outline">
					<AdjustmentsHorizontalIcon />
				</Button>
			</nav>
		</main>
	);
}

export default App;
