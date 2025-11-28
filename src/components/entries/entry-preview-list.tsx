import { For, Show } from "solid-js";
import type { Entry } from "@/schemas";
import { EntryDateCard } from "./entry-date-card";
import { EntryPreviewItem } from "./entry-preview-item";

type EntryPreviewListProps = {
	data: Array<{ date: string; entries: Entry[] }>;
	onEntryClick: (entry: Entry) => void;
};

export const EntryPreviewList = (props: EntryPreviewListProps) => (
	<div class="space-y-6 divide-y">
		<For each={props.data}>
			{({ date, entries }) => (
				<EntryDateCard date={date}>
					<For each={entries}>
						{(entry) => (
							<EntryPreviewItem
								entry={entry}
								onClick={
									props.onEntryClick ? () => props.onEntryClick(entry) : undefined
								}
							/>
						)}
					</For>
				</EntryDateCard>
			)}
		</For>
		<Show when={props.data.length === 0}>
			<div class="p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center bg-black rounded-xl">
				Past entries will appear here
			</div>
		</Show>
	</div>
);
