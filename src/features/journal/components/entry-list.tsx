import { For, Show } from "solid-js";
import type { Entry } from "@/lib/db";
import { formatTime } from "@/lib/utils/dates";
import { createCommentQuery } from "../resources";
import { EntryCommentItem } from "./entry-comment-item";

const EntryItem = (props: { entry: Entry; onClick: () => void }) => {
	const comments = createCommentQuery(() => props.entry.id);

	return (
		<article
			onClick={props.onClick}
			onKeyDown={(e) => {
				if ((e.key === "Enter" || e.key === " ") && props.onClick) {
					e.preventDefault();
					props.onClick();
				}
			}}
			tabindex={0}
			class="cursor-default bg-black transition-colors rounded-xl p-4 hover:bg-darkgray/30"
		>
			<time class="text-lightgray/70 text-sm">
				{formatTime(props.entry.createdAt)}
			</time>
			<p class="mt-0.5 max-w-[65ch] text-base text-lightgray leading-relaxed">
				{props.entry.content}
			</p>
			<Show when={comments().length > 0}>
				<div class="mt-1">
					<For each={comments()}>
						{(comment) => <EntryCommentItem comment={comment} />}
					</For>
				</div>
			</Show>
		</article>
	);
};

export const EntryList = (props: {
	entries: Entry[];
	onEntryClick: (entry: Entry) => void;
}) => {
	return (
		<div class="rounded-xl bg-black p-1.5">
			<For each={props.entries} fallback={<NoEntries />}>
				{(entry) => (
					<EntryItem entry={entry} onClick={() => props.onEntryClick(entry)} />
				)}
			</For>
		</div>
	);
};

const NoEntries = () => (
	<div class="p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center">
		No entries yet
	</div>
);
