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
			<h1 className="text-2xl font-bold p-2 mb-4 font-serif">Welcome back</h1>
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
			<div className="flex justify-between fixed bottom-[calc(var(--safe-bottom)+(var(--spacing)*4))] inset-x-4">
				<div className="bg-popover/90 border flex gap-4 items-center rounded-lg p-2 backdrop-blur-xs shadow-xs">
					<Button type="button" variant="outline">
						<BookmarkIcon />
					</Button>
					<Button type="button" variant="outline">
						<AdjustmentsHorizontalIcon />
					</Button>
				</div>
				<div className="bg-popover/90 border flex gap-4 items-center rounded-lg p-2 backdrop-blur-xs shadow-xs">
					<CreateEntryDialog />
				</div>
			</div>
		</main>
	);
}

export default App;
