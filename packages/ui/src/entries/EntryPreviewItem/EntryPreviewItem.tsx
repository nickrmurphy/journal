import { useEntryComments } from "@journal/core/hooks";
import type { Entry } from "@journal/core/schemas";
import { formatTime } from "@journal/utils/dates";
import { ChatTeardropIcon } from "@phosphor-icons/react";
import { cx } from "cva";
import type { ComponentProps } from "react";

const Root = (
	props: ComponentProps<"article"> & {
		isClickable?: boolean;
	},
) => {
	const { isClickable, ...domProps } = props;
	return (
		<article
			{...domProps}
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
	entry: Entry;
	onClick?: () => void;
}) => {
	const { data: comments } = useEntryComments(props.entry.id);

	return (
		<Root onClick={props.onClick} isClickable={!!props.onClick}>
			<Metadata>
				<time>{formatTime(props.entry.createdAt)}</time>
				<span>{comments.length > 0 ? <ChatTeardropIcon /> : null}</span>
			</Metadata>
			<Content>{props.entry.content}</Content>
		</Root>
	);
};
