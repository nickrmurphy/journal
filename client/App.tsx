import { Dialog } from "@base-ui-components/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import {
	type FC,
	type PropsWithChildren,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { Button } from "./components/Button";
import { CreateEntryDialog } from "./components/CreateEntryDialog";
import { EntryDialog } from "./components/EntryDialog";
import { PastEntries } from "./components/PastEntries";
import { TodayEntries } from "./components/TodayEntries";
import { TodayHeader } from "./components/TodayHeader";

const Nav = ({ onCreateEntry }: { onCreateEntry: () => void }) => (
	<div className="flex justify-end fixed bottom-[calc(var(--safe-bottom)+var(--spacing)*4)] inset-x-4">
		<Button size="lg" onClick={onCreateEntry}>
			<PencilSquareIcon />
		</Button>
	</div>
);

const Page: FC<PropsWithChildren> = ({ children }) => (
	<main className="bg-background w-[calc(100%-theme(spacing.4))] gap-5 flex flex-col rounded-xl shadow flex-1 m-auto h-[calc(100dvh-theme(spacing.4))] my-2 p-2 overflow-y-auto [overscroll-behavior-y:contain] pb-20">
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

	return (
		<div className="relative">
			{/* Horizontal pager: three equal pages with scroll snap; center page is Today */}
			<div
				ref={scrollerRef}
				className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory w-full h-[100dvh] [scroll-behavior:auto]"
				/* Prevent rubber-band overscroll showing background behind cards */
			>
				{/* Left page (empty content placeholder, same sizing) */}
				<section className="snap-center shrink-0 w-screen px-0">
					<Page>
						<section className="space-y-2">
							<PastEntries onSelect={setDetailId} />
						</section>
					</Page>
				</section>

				{/* Center page: Today content */}
				<section className="snap-center shrink-0 w-screen px-0">
					<Page>
						<section>
							<TodayHeader />
							<TodayEntries onSelectEntry={setDetailId} />
						</section>
					</Page>
				</section>

				{/* Right page (empty content placeholder, same sizing) */}
				<section className="snap-center shrink-0 w-screen px-0">
					<Page>{/* Intentionally blank page */}</Page>
				</section>
			</div>

			<Nav onCreateEntry={() => setCreateEntryOpen(true)} />
			<Dialog.Root
				open={detailId !== null}
				onOpenChange={() => {
					setDetailId(null);
				}}
			>
				<EntryDialog entryId={detailId} />
			</Dialog.Root>
			<Dialog.Root
				open={createEntryOpen}
				onOpenChange={setCreateEntryOpen}
			>
				<CreateEntryDialog open={createEntryOpen} onOpenChange={setCreateEntryOpen} />
			</Dialog.Root>
		</div>
	);
}

export default App;
