import type { JournalEntry } from "@journal/core/types";
import { formatTime } from "@journal/utils/dates";
import { ChatTeardropIcon } from "@phosphor-icons/react";
import { cx } from "cva";
import type { ComponentProps } from "react";

const Root = (props: ComponentProps<"article">) => (
	<article
		{...props}
		className={cx(
			"cursor-default rounded p-3 text-lightgray/70 transition-all duration-300 hover:bg-darkgray/30 hover:text-lightgray",
			props.className,
		)}
	/>
);

const Metadata = (props: ComponentProps<"div">) => (
	<div
		{...props}
		className={cx("flex items-center gap-1.5 text-xs", props.className)}
	/>
);

const Content = (props: ComponentProps<"p">) => (
	<p
		{...props}
		className={cx("mt-2 line-clamp-3 text-ellipsis text-sm", props.className)}
	/>
);

export const EntryPreviewItem = (props: { entry: JournalEntry }) => {
	return (
		<Root>
			<Metadata>
				<time>{formatTime(props.entry.createdAt)}</time>
				<span>
					{props.entry.comments.length > 0 ? <ChatTeardropIcon /> : null}
				</span>
			</Metadata>
			<Content>{props.entry.content}</Content>
		</Root>
	);
};
