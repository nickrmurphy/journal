import { Show } from "solid-js";
import { EntryList } from "@/components/entries";
import { useCurrentDate, useEntriesOnDate } from "@/hooks";
import type { Entry } from "@/schemas";

export function TodayEntries(props: {
	onEntryClick: (entry: Entry) => void;
}) {
	const today = useCurrentDate();
	const entries = useEntriesOnDate(today);

	return (
		<Show
			when={entries().length > 0}
			fallback={
				<p class="text-center p-10 text-lg text-lightgray/70">
					No entries yet today
				</p>
			}
		>
			<EntryList entries={entries()} onEntryClick={props.onEntryClick} />
		</Show>
	);
}
