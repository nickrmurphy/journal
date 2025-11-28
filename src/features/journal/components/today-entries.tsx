import { Show } from "solid-js";
import type { Entry } from "@/lib/db";
import { createDateNow } from "@/lib/primitives";
import { createEntriesQuery } from "../resources";
import { EntryList } from "./entry-list";

export function TodayEntries(props: { onEntryClick: (entry: Entry) => void }) {
	const today = createDateNow();
	const entries = createEntriesQuery(today());

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
