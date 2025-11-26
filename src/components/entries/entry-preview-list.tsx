import type { Entry } from "@/schemas";
import { EntryDateCard } from "./entry-date-card";
import { EntryPreviewItem } from "./entry-preview-item";

type EntryPreviewListProps = {
	data: Array<{ date: string; entries: Entry[] }>;
	onEntryClick?: (entry: Entry) => void;
};

export const EntryPreviewList = (props: EntryPreviewListProps) => (
	<div className="space-y-6 divide-y">
		{props.data.map(({ date, entries }) => (
			<EntryDateCard key={date} date={date}>
				{entries.map((entry) => (
					<EntryPreviewItem
						key={entry.id}
						entry={entry}
						onClick={props.onEntryClick ? () => props.onEntryClick(entry) : undefined}
					/>
				))}
			</EntryDateCard>
		))}
		{props.data.length === 0 && (
			<div className="p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center bg-black rounded-xl">
				Past entries will appear here
			</div>
		)}
	</div>
);
