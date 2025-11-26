import { EntryList } from "@/components/entries";
import { useCurrentDate, useEntriesOnDate } from "@/hooks";
import type { Entry } from "@/schemas";

export function TodayEntries({
	onEntryClick,
}: {
	onEntryClick: (entry: Entry) => void;
}) {
	const today = useCurrentDate();
	const entries = useEntriesOnDate(today);

	return entries.length > 0 ? (
		<EntryList entries={entries} onEntryClick={onEntryClick} />
	) : (
		<p className="text-center p-10 text-lg text-lightgray/70">
			No entries yet today
		</p>
	);
}
