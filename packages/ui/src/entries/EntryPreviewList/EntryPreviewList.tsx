import type { JournalEntry } from "@journal/core/types";
import { EntryDateCard } from "../EntryDateCard";
import { EntryPreviewItem } from "../EntryPreviewItem";

type EntryPreviewListProps = {
	data: Array<{ date: string; entries: JournalEntry[] }>;
};
export const EntryPreviewList = (props: EntryPreviewListProps) => (
	<div className="space-y-6 divide-y">
		{props.data.map(({ date, entries }) => (
			<EntryDateCard key={date} date={date}>
				{entries.map((entry) => (
					<EntryPreviewItem key={entry.createdAt} entry={entry} />
				))}
			</EntryDateCard>
		))}
	</div>
);
