import { For, Show } from "solid-js";
import type { Entry } from "@/lib/db";
import { formatTime } from "@/lib/utils/dates";
import { useEntryComments } from "../hooks";
import { EntryCommentItem } from "./entry-comment-item";

export const EntryItem = (props: { entry: Entry; onClick?: () => void }) => {
	const comments = useEntryComments(props.entry.id);

	return (
		<article
			onClick={props.onClick}
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
