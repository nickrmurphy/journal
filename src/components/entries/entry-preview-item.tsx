import { ChatTeardrop } from "solid-phosphor";
import { cx } from "cva";
import { Show } from "solid-js";
import { useEntryComments } from "@/hooks";
import type { Entry } from "@/schemas";
import { formatTime } from "@/utils/dates";

export const EntryPreviewItem = (props: {
	entry: Entry;
	onClick?: () => void;
}) => {
	const comments = useEntryComments(() => props.entry.id);

	return (
		<article
			onClick={props.onClick}
			class={cx(
				"rounded-xl p-3 text-lightgray/70 transition-colors duration-300 hover:bg-darkgray/30 hover:text-lightgray",
				props.onClick ? "cursor-pointer" : "cursor-default",
			)}
		>
			<div class="flex items-center gap-1.5 text-xs">
				<time>{formatTime(props.entry.createdAt)}</time>
				<Show when={comments().length > 0}>
					<span><ChatTeardrop /></span>
				</Show>
			</div>
			<p class="mt-2 line-clamp-3 text-ellipsis text-sm">
				{props.entry.content}
			</p>
		</article>
	);
};
