import {
	commentsCollection,
	entriesCollection,
} from "@journal/core/collections";
import { useEntries, useEntriesOnDate } from "@journal/core/hooks";
import type { Entry } from "@journal/core/schemas";
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

import { isSameDay } from "date-fns";
import { type ReactNode, useMemo, useState } from "react";
import {
	formatDay,
	formatMonthDate,
} from "../../../packages/utils/src/dates/format";

const Container = (props: { children: ReactNode }) => (
	<div className="mx-auto flex w-full flex-col gap-3" {...props} />
);

const Navbar = () => {
	const add = ({ content }: { content: string }) => {
		entriesCollection.insert({
			content,
		});
	};
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
				<div className="ms-auto flex items-center gap-2">
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
	const { data: entries } = useEntriesOnDate(today);
	const { data: allEntries } = useEntries();

	const pastEntries = useMemo(() => {
		if (!allEntries) return [];

		const grouped = allEntries
			.filter((e) => !isSameDay(today, e.createdAt))
			.reduce(
				(acc, entry) => {
					// biome-ignore lint/style/noNonNullAssertion: <always defined>
					const date = entry.createdAt.split("T")[0]!;
					if (!acc[date]) {
						acc[date] = [];
					}
					acc[date].push({
						id: entry.id,
						content: entry.content,
						createdAt: entry.createdAt,
					});
					return acc;
				},
				{} as Record<
					string,
					{ id: string; content: string; createdAt: string }[]
				>,
			);

		return Object.entries(grouped).map(([date, entries]) => ({
			date,
			entries,
		}));
	}, [allEntries, today]);

	const [selectedEntry, setSelectedEntry] = useState<{
		entry: Entry;
	} | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleEntryClick = (entry: Entry, _layoutId: string) => {
		setSelectedEntry({ entry });
		setIsDialogOpen(true);
	};

	const handleComment = (content: string) => {
		if (selectedEntry) {
			commentsCollection.insert({
				entryId: selectedEntry.entry.id,
				content,
			});
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
					<EntryList entries={entries} onEntryClick={handleEntryClick} />
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
