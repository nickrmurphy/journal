import { useEntryComments } from "@journal/core/stores/journalEntryStore.js";
import type { JournalEntry } from "@journal/core/types";
import { formatTime } from "@journal/utils/dates";
import { cx } from "cva";
import type { ComponentProps } from "react";
import { EntryCommentItem } from "../EntryCommentItem/EntryCommentItem";

const Root = (props: ComponentProps<"article">) => (
	<article
		{...props}
		className={cx(
			"cursor-default bg-black transition-colors rounded p-4 hover:bg-darkgray/30",
			props.className,
		)}
	/>
);

const Time = (props: ComponentProps<"time">) => (
	<time
		{...props}
		className={cx("text-lightgray/70 text-sm", props.className)}
	/>
);

const Content = (props: ComponentProps<"p">) => (
	<p
		{...props}
		className={cx(
			"mt-0.5 max-w-[65ch] text-base text-lightgray leading-relaxed",
			props.className,
		)}
	/>
);

export const EntryItem = (props: {
	entry: JournalEntry;
	onClick?: () => void;
}) => {
	const comments = useEntryComments(props.entry.id);

	return (
		<Root onClick={props.onClick}>
			<Time>{formatTime(props.entry.createdAt)}</Time>
			<Content>{props.entry.content}</Content>
			{comments.length > 0 && (
				<div className="mt-1">
					{comments.map((comment) => (
						<EntryCommentItem key={comment.id} comment={comment} />
					))}
				</div>
			)}
		</Root>
	);
};
