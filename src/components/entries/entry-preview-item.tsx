import { ChatTeardropIcon } from "@phosphor-icons/react";
import { cx } from "cva";
import { useEntryComments } from "@/hooks";
import type { Entry } from "@/schemas";
import { formatTime } from "@/utils/dates";

export const EntryPreviewItem = (props: {
	entry: Entry;
	onClick?: () => void;
}) => {
	const comments = useEntryComments(props.entry.id);
	const isClickable = !!props.onClick;

	return (
		<article
			onClick={props.onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					props.onClick?.();
				}
			}}
			className={cx(
				"rounded-xl p-3 text-lightgray/70 transition-colors duration-300 hover:bg-darkgray/30 hover:text-lightgray",
				isClickable ? "cursor-pointer" : "cursor-default",
			)}
		>
			<div className="flex items-center gap-1.5 text-xs">
				<time>{formatTime(props.entry.createdAt)}</time>
				<span>{comments.length > 0 ? <ChatTeardropIcon /> : null}</span>
			</div>
			<p className="mt-2 line-clamp-3 text-ellipsis text-sm">
				{props.entry.content}
			</p>
		</article>
	);
};
