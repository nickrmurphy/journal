import { For, Show } from "solid-js";
import type { Entry } from "@/schemas";
import { EntryItem } from "./entry-item";

export const EntryList = (props: {
	entries: Entry[];
	onEntryClick?: (entry: Entry) => void;
}) => {
	return (
		<div class="rounded-xl bg-black p-1.5">
			<For each={props.entries}>
				{(entry) => (
					<EntryItem
						entry={entry}
						onClick={props.onEntryClick ? () => props.onEntryClick?.(entry) : undefined}
					/>
				)}
			</For>

			<Show when={props.entries.length === 0}>
				<div class="p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center">
					No entries yet
				</div>
			</Show>
		</div>
	);
};
