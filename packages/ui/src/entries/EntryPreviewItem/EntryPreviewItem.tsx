import { useEntryComments } from "@journal/core/stores/journalEntryStore.js";
import type { JournalEntry } from "@journal/core/types";
import { formatTime } from "@journal/utils/dates";
import { ChatTeardropIcon } from "@phosphor-icons/react";
import { cx } from "cva";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

const Root = (
	props: ComponentProps<typeof motion.article> & {
		layoutId?: string;
		isClickable?: boolean;
	},
) => {
	const { isClickable, ...domProps } = props;
	return (
		<motion.article
			{...domProps}
			layoutId={props.layoutId}
			className={cx(
				"rounded p-3 text-lightgray/70 transition-colors duration-300 hover:bg-darkgray/30 hover:text-lightgray",
				isClickable ? "cursor-pointer" : "cursor-default",
				props.className,
			)}
		/>
	);
};

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

export const EntryPreviewItem = (props: {
	entry: JournalEntry;
	onClick?: () => void;
	layoutId?: string;
}) => {
	const comments = useEntryComments(props.entry.id);

	return (
		<Root
			onClick={props.onClick}
			layoutId={props.layoutId}
			isClickable={!!props.onClick}
		>
			<Metadata>
				<time>{formatTime(props.entry.createdAt)}</time>
				<span>{comments.length > 0 ? <ChatTeardropIcon /> : null}</span>
			</Metadata>
			<Content>{props.entry.content}</Content>
		</Root>
	);
};
