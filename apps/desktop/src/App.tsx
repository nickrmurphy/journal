import {
	useEntriesInRange,
	useEntriesOnDate,
	useJournalEntries,
} from "@journal/core/stores/journalEntryStore.js";
import type { JournalEntry } from "@journal/core/types";
import {
	AsideLayout,
	Button,
	EntryCreateDialog,
	EntryDetailDialog,
	EntryList,
	EntryPreviewList,
} from "@journal/ui";
import { useCurrentDate } from "@journal/utils/hooks";
import { PenIcon } from "@phosphor-icons/react";
import { type ReactNode, useMemo, useState } from "react";
import {
	formatDay,
	formatMonthDate,
} from "../../../packages/utils/src/dates/format";

const Container = (props: { children: ReactNode }) => (
	<div className="mx-auto flex w-full max-w-3xl flex-col gap-3" {...props} />
);

const Navbar = () => {
	const add = useJournalEntries((state) => state.addEntry);
	const today = useCurrentDate();
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
			<nav className="sticky top-0 bg-black/50 rounded-full backdrop-blur flex items-center border p-1.5 pl-3.5 mx-0.5">
				<span className="flex items-baseline gap-2">
					<span className="font-semibold text-xl text-lightgray/90">
						{formatMonthDate(today)}
					</span>
					<span className="text-sm text-lightgray/70">{formatDay(today)}</span>
				</span>

				<Button
					variant="solid-yellow"
					size="md-icon"
					className="ms-auto"
					onClick={() => setShowDialog(true)}
				>
					<PenIcon />
				</Button>
			</nav>
			<EntryCreateDialog
				open={showDialog}
				onClose={() => setShowDialog(false)}
				onSubmit={(content) => {
					add({ content });
					setShowDialog(false);
				}}
			/>
		</>
	);
};

function App() {
	const today = useCurrentDate();
	const entries = useEntriesOnDate(today);
	const pastEntries = useEntriesInRange(new Date(0).toISOString(), today);
	const comment = useJournalEntries((state) => state.addComment);

	const reversedEntries = useMemo(() => entries.toReversed(), [entries]);

	const [selectedEntry, setSelectedEntry] = useState<{
		entry: JournalEntry;
		layoutId: string;
	} | null>(null);

	const handleEntryClick = (entry: JournalEntry, layoutId: string) => {
		setSelectedEntry({ entry, layoutId });
	};

	const handleComment = (content: string) => {
		if (selectedEntry) {
			comment(selectedEntry.entry.id, content);
		}
	};

	return (
		<AsideLayout.Root>
			<AsideLayout.Aside>
				<EntryPreviewList data={pastEntries} onEntryClick={handleEntryClick} />
			</AsideLayout.Aside>
			<AsideLayout.Main>
				<Container>
					<Navbar />
					<EntryList
						entries={reversedEntries}
						onEntryClick={handleEntryClick}
					/>
				</Container>
			</AsideLayout.Main>
			{selectedEntry && (
				<EntryDetailDialog
					entry={selectedEntry.entry}
					layoutId={selectedEntry.layoutId}
					isOpen={!!selectedEntry}
					onClose={() => setSelectedEntry(null)}
					onComment={handleComment}
				/>
			)}
		</AsideLayout.Root>
	);
}

export default App;
