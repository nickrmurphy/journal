import { useEntriesOnDate } from "@journal/core/hooks";
import { EntryList } from "@journal/ui";
import { useCurrentDate } from "@journal/utils/hooks";

export function TodayEntries() {
	const today = useCurrentDate();
	const { data: entries } = useEntriesOnDate(today);

	return <EntryList entries={entries} onEntryClick={console.log} />;
}
