import {
	downloadJournalData,
	importFromFile,
	useEntriesInRange,
	useEntriesOnDate,
	useJournalEntries,
} from "@journal/core/stores/journalEntryStore.js";
import type { JournalEntry } from "@journal/core/types";
import {
	AsideLayout,
	Button,
	DataMenu,
	EntryCreateDialog,
	EntryDetailDialog,
	EntryList,
	EntryPreviewList,
	Menu,
} from "@journal/ui";
import { useCurrentDate } from "@journal/utils/hooks";
import { DotsThreeVerticalIcon, PenIcon } from "@phosphor-icons/react";
import { type ReactNode, useMemo, useState } from "react";
import {
	formatDay,
	formatMonthDate,
} from "../../../packages/utils/src/dates/format";

const Container = (props: { children: ReactNode }) => (
	<div className="mx-auto flex w-full flex-col gap-3" {...props} />
);

const Navbar = () => {
	const add = useJournalEntries((state) => state.addEntry);
	const today = useCurrentDate();
	const [showDialog, setShowDialog] = useState(false);

	const handleExport = () => {
		downloadJournalData();
	};

	const handleImport = async () => {
		const result = await importFromFile();
		if (result) {
			if (result.success) {
				console.log(
					`Imported ${result.imported.entries} entries, ${result.imported.comments} comments`,
				);
				if (result.skipped.entries > 0 || result.skipped.comments > 0) {
					console.log(
						`Skipped ${result.skipped.entries} entries, ${result.skipped.comments} comments`,
					);
				}
			} else {
				console.error("Import failed:", result.errors);
			}
		}
	};

	return (
		<>
			<nav className="sticky top-0 bg-black/50 rounded-full backdrop-blur flex items-center border p-1.5 pl-3.5 mx-0.5">
				<span className="flex items-baseline gap-2">
					<span className="font-semibold text-xl text-lightgray/90">
						{formatMonthDate(today)}
					</span>
					<span className="text-sm text-lightgray/70">{formatDay(today)}</span>
				</span>
				<div className="ms-auto flex items-center gap-2">
					<Menu.Root
						positioning={{
							placement: "bottom-end",
							offset: { mainAxis: 4 },
						}}
					>
						<Menu.Trigger asChild>
							<Button variant="outline-lightgray" size="md-icon">
								<DotsThreeVerticalIcon />
							</Button>
						</Menu.Trigger>
						<DataMenu onExport={handleExport} onImport={handleImport} />
					</Menu.Root>
					<Button
						variant="solid-yellow"
						size="md-icon"
						className="ms-auto"
						onClick={() => setShowDialog(true)}
					>
						<PenIcon />
					</Button>
				</div>
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
	} | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleEntryClick = (entry: JournalEntry, _layoutId: string) => {
		setSelectedEntry({ entry });
		setIsDialogOpen(true);
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
			<EntryDetailDialog
				entry={selectedEntry?.entry}
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onExitComplete={() => setSelectedEntry(null)}
				onComment={handleComment}
			/>
		</AsideLayout.Root>
	);
}

export default App;
