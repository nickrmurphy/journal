import type { Entry } from "@/schemas";
import { EntryItem } from "./entry-item";

export const EntryList = ({
	entries,
	onEntryClick,
}: {
	entries: Entry[];
	onEntryClick?: (entry: Entry) => void;
}) => {
	return (
		<div className="rounded-xl bg-black p-1.5">
			{entries.map((entry) => (
				<EntryItem
					key={entry.id}
					entry={entry}
					onClick={onEntryClick ? () => onEntryClick(entry) : undefined}
				/>
			))}

			{entries.length === 0 && (
				<div className="p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center">
					No entries yet
				</div>
			)}
		</div>
	);
};
