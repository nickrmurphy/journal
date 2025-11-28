import { MessageCircle } from "lucide-solid";
import { For, Show } from "solid-js";
import type { Entry } from "@/lib/db";
import { formatTime } from "@/lib/utils/dates";
import { createCommentQuery } from "../resources";
import { EntryDateCard } from "./entry-date-card";

const EntryPreviewItem = (props: { entry: Entry; onClick: () => void }) => {
	const comments = createCommentQuery(() => props.entry.id);

	return (
		<article
			onClick={props.onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					props.onClick();
				}
			}}
			class="rounded-xl p-3 text-lightgray/70 transition-colors duration-300 hover:bg-darkgray/30 hover:text-lightgray cursor-pointer"
		>
			<div class="flex items-center gap-1.5 text-xs">
				<time>{formatTime(props.entry.createdAt)}</time>
				<Show when={comments().length > 0}>
					<span>
						<MessageCircle />
					</span>
				</Show>
			</div>
			<p class="mt-2 line-clamp-3 text-ellipsis text-sm">
				{props.entry.content}
			</p>
		</article>
	);
};

type EntryPreviewListProps = {
	data: Array<{ date: string; entries: Entry[] }>;
	onEntryClick: (entry: Entry) => void;
};

export const EntryPreviewList = (props: EntryPreviewListProps) => (
	<div class="space-y-6 divide-y">
		<For each={props.data} fallback={<NoEntries />}>
			{({ date, entries }) => (
				<EntryDateCard date={date}>
					<For each={entries}>
						{(entry) => (
							<EntryPreviewItem
								entry={entry}
								onClick={() => props.onEntryClick(entry)}
							/>
						)}
					</For>
				</EntryDateCard>
			)}
		</For>
	</div>
);

const NoEntries = () => (
	<div class="p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center bg-black rounded-xl">
		Past entries will appear here
	</div>
);
