import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
	type FC,
	type PropsWithChildren,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { entryCollection, type Entry } from "./collections/entries";
import {
  entryCommentCollection,
  type EntryComment,
} from "./collections/entryComments";
import { Button } from "./components/Button";
import { CreateEntryDialog } from "./components/CreateEntryDialog";
import { EntryDialog } from "./components/EntryDialog";
import { PastEntries } from "./components/PastEntries";
import { TodayEntries } from "./components/TodayEntries";
import { TodayHeader } from "./components/TodayHeader";

const Nav = ({ onCreateEntry }: { onCreateEntry: () => void }) => (
	<div className="fixed inset-x-4 bottom-[calc(var(--safe-bottom)+var(--spacing)*4)] flex justify-end">
		<Button size="lg" onClick={onCreateEntry}>
			<PencilSquareIcon />
		</Button>
	</div>
);

const Page: FC<PropsWithChildren> = ({ children }) => (
	<main className="m-auto my-2 flex h-[calc(100dvh-theme(spacing.4))] w-[calc(100%-theme(spacing.4))] flex-1 flex-col gap-5 overflow-y-auto rounded-lg bg-background p-2 pb-20 shadow [overscroll-behavior-y:contain]">
		{children}
	</main>
);

function App() {
	const [detailId, setDetailId] = useState<string | null>(null);
	const [createEntryOpen, setCreateEntryOpen] = useState(false);
	const scrollerRef = useRef<HTMLDivElement | null>(null);

	// Start on the center page without visible scroll (no smooth)
	useLayoutEffect(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		// Each page is one viewport width (w-screen); center page is index 1
		scroller.scrollTo({ left: scroller.clientWidth, behavior: "auto" });
	}, []);

	const handleExport = () => {
		// Convert IterableIterator to arrays
		const entries: Entry[] = Array.from(entryCollection.values());
		const entryComments: EntryComment[] = Array.from(
			entryCommentCollection.values(),
		);

		// Group comments by entryId for efficient join
		const commentsByEntryId = new Map<string, EntryComment[]>();
		for (const c of entryComments) {
			const list = commentsByEntryId.get(c.entryId) ?? [];
			list.push(c);
			commentsByEntryId.set(c.entryId, list);
		}

		// Join comments to their respective entries via entryComment.entryId -> entry.id
		const joined = entries.map((entry) => ({
			...entry,
			comments: commentsByEntryId.get(entry.id) ?? [],
		}));

		// Create a JSON blob and trigger a download
		const json = JSON.stringify(joined, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		a.href = url;
		a.download = `journal-export-${timestamp}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="relative">
			{/* Horizontal pager: three equal pages with scroll snap; center page is Today */}
			<div
				ref={scrollerRef}
				className="flex h-[100dvh] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden [scroll-behavior:auto]"
				/* Prevent rubber-band overscroll showing background behind cards */
			>
				{/* Left page (empty content placeholder, same sizing) */}
				<section className="w-screen shrink-0 snap-center px-0">
					<Page>
						<section className="space-y-2">
							<PastEntries onSelect={setDetailId} />
						</section>
					</Page>
				</section>

				{/* Center page: Today content */}
				<section className="w-screen shrink-0 snap-center px-0">
					<Page>
						<section className="space-y-4">
							<div className="px-2 pt-2">
								<TodayHeader />
							</div>
							<TodayEntries onSelectEntry={setDetailId} />
						</section>
					</Page>
				</section>

				<section className="snap-center shrink-0 w-screen px-0">
					<Page>
						<Button onClick={handleExport}>Export</Button>
					</Page>
				</section>
			</div>

			<Nav onCreateEntry={() => setCreateEntryOpen(true)} />
			<EntryDialog entryId={detailId} onClose={() => setDetailId(null)} />
			<CreateEntryDialog
				open={createEntryOpen}
				onOpenChange={setCreateEntryOpen}
			/>
		</div>
	);
}

export default App;
