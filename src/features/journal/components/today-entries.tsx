import { Show } from "solid-js";
import type { Entry } from "@/lib/db";
import { useCurrentDate } from "@/lib/hooks";
import { useEntriesOnDate } from "../hooks";
import { EntryList } from "./entry-list";

export function TodayEntries(props: { onEntryClick: (entry: Entry) => void }) {
	const today = useCurrentDate();
	const entries = useEntriesOnDate(today());

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
