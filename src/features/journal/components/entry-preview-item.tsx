import { cx } from "cva";
import { MessageCircle } from "lucide-solid";
import { createMemo, Show } from "solid-js";
import type { Entry } from "@/lib/db";
import { formatTime } from "@/lib/utils/dates";
import { useEntryComments } from "../hooks";

export const EntryPreviewItem = (props: {
	entry: Entry;
	onClick?: () => void;
}) => {
	const comments = useEntryComments(props.entry.id);
	const isClickable = createMemo(() => !!props.onClick);

	return (
		<article
			onClick={props.onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					props.onClick?.();
				}
			}}
			class={cx(
				"rounded-xl p-3 text-lightgray/70 transition-colors duration-300 hover:bg-darkgray/30 hover:text-lightgray",
				isClickable() ? "cursor-pointer" : "cursor-default",
			)}
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
