import {
	AdjustmentsHorizontalIcon,
	BookmarkIcon,
} from "@heroicons/react/16/solid";
import { useLiveQuery } from "@tanstack/react-db";
import { AnimatePresence, motion } from "motion/react";
import { entryCollection } from "./collections/entries";
import { Button } from "./components/Button";
import { CreateEntryDialog } from "./components/CreateEntryDialog";
import { formatEntryDate } from "./utils/formatDate";

function App() {
	const { data } = useLiveQuery((q) =>
		q
			.from({ entries: entryCollection })
			.orderBy((e) => e.entries.createdAt, "desc"),
	);

	return (
		<main className="bg-background w-[calc(100%-theme(spacing.4))] flex flex-col rounded-xl shadow flex-1 m-auto min-h-[calc(100vh-theme(spacing.4))] my-2 p-2 overflow-auto">
			<h1 className="text-2xl font-bold p-2 mb-4 font-serif">Welcome back</h1>
			<motion.section layout className="space-y-2">
				<AnimatePresence initial={false} mode="popLayout">
					{data.map((e) => (
						<motion.article
							key={e.id}
							layout
							initial={{ opacity: 0, y: -16 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -16 }}
							transition={{
								type: "spring",
								stiffness: 320,
								damping: 28,
								mass: 0.6,
							}}
							className="text-card-foreground border-border/50 border rounded-lg bg-card px-2 py-3 space-y-1"
						>
							<h2 className="text-xs text-muted-foreground">
								{formatEntryDate(e.createdAt)}
							</h2>
							<p>{e.content}</p>
						</motion.article>
					))}
				</AnimatePresence>
			</motion.section>
			<div className="flex justify-between fixed bottom-[calc(var(--safe-bottom)+(var(--spacing)*4))] inset-x-4">
				<div className="bg-popover/90 border flex gap-4 items-center rounded-lg p-2 backdrop-blur-xs shadow-xs">
					<Button type="button" variant="outline">
						<BookmarkIcon />
					</Button>
					<Button type="button" variant="outline">
						<AdjustmentsHorizontalIcon />
					</Button>
				</div>
				<div className="">
					<CreateEntryDialog />
				</div>
			</div>
		</main>
	);
}

export default App;
