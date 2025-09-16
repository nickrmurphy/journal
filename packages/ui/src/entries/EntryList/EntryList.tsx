import type { JournalEntry } from "@journal/core/types";
import { EntryItem } from "../..";

const EmptyState = () => (
	<div className="p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center">
		No entries yet
	</div>
);

export const EntryList = ({ entries }: { entries: JournalEntry[] }) => (
	<div className="rounded bg-black p-1.5 shadow">
		{entries.map((entry) => (
			<EntryItem key={entry.createdAt} entry={entry} />
		))}
		{entries.length === 0 && <EmptyState />}
	</div>
);
