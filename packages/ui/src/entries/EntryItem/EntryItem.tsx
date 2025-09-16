import type { JournalEntry } from "@journal/core/types";
import { formatTime } from "@journal/utils/dates";
import { ArrowBendDownRightIcon } from "@phosphor-icons/react";
import { cx } from "cva";
import type { ComponentProps } from "react";

const Root = (props: ComponentProps<"article">) => (
	<article
		{...props}
		className={cx(
			"cursor-default bg-black rounded p-4 transition-all duration-300 hover:bg-darkgray/30",
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

const Comments = (props: ComponentProps<"div">) => (
	<div {...props} className={cx("mt-1", props.className)} />
);

const Comment = (props: ComponentProps<"div">) => (
	<div
		{...props}
		className={cx("flex items-center gap-2 p-2", props.className)}
	>
		<ArrowBendDownRightIcon className="size-4" />
		{props.children}
	</div>
);

const CommentText = (props: ComponentProps<"p">) => (
	<p
		{...props}
		className={cx("max-w-[55ch] text-lightgray/70 text-sm", props.className)}
	/>
);

export const EntryItem = (props: { entry: JournalEntry }) => {
	return (
		<Root>
			<Time>{formatTime(props.entry.createdAt)}</Time>
			<Content>{props.entry.content}</Content>
			{props.entry.comments.length > 0 && (
				<Comments>
					{props.entry.comments.map((comment) => (
						<Comment key={comment.createdAt}>
							<CommentText>{comment.content}</CommentText>
						</Comment>
					))}
				</Comments>
			)}
		</Root>
	);
};
