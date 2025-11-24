import { useEntriesOnDate } from "@journal/core/hooks";
import type { Entry } from "@journal/core/schemas";
import { EntryList } from "@journal/ui";
import { useCurrentDate } from "@journal/utils/hooks";

export function TodayEntries({
	onEntryClick,
}: {
	onEntryClick: (entry: Entry) => void;
}) {
	const today = useCurrentDate();
	const { data: entries } = useEntriesOnDate(today);

	return entries.length > 0 ? (
		<EntryList entries={entries} onEntryClick={onEntryClick} />
	) : (
		<p className="text-center p-10 text-lg text-lightgray/70">
			No entries yet today
		</p>
	);
}
