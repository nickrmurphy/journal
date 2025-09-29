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

	return <EntryList entries={entries} onEntryClick={onEntryClick} />;
}
