import { ChatTeardrop } from "solid-phosphor";
import { cx } from "cva";
import { Show, type ComponentProps } from "solid-js";
import { useEntryComments } from "@/hooks";
import type { Entry } from "@/schemas";
import { formatTime } from "@/utils/dates";

const Root = (
	props: ComponentProps<"article"> & {
		isClickable?: boolean;
	},
) => {
	const { isClickable, ...domProps } = props;
	return (
		<article
			{...domProps}
			class={cx(
				"rounded-xl p-3 text-lightgray/70 transition-colors duration-300 hover:bg-darkgray/30 hover:text-lightgray",
				isClickable ? "cursor-pointer" : "cursor-default",
				props.class,
			)}
		/>
	);
};

const Metadata = (props: ComponentProps<"div">) => (
	<div
		{...props}
		class={cx("flex items-center gap-1.5 text-xs", props.class)}
	/>
);

const Content = (props: ComponentProps<"p">) => (
	<p
		{...props}
		class={cx("mt-2 line-clamp-3 text-ellipsis text-sm", props.class)}
	/>
);

export const EntryPreviewItem = (props: {
	entry: Entry;
	onClick?: () => void;
}) => {
	const comments = useEntryComments(() => props.entry.id);

	return (
		<Root onClick={props.onClick} isClickable={!!props.onClick}>
			<Metadata>
				<time>{formatTime(props.entry.createdAt)}</time>
				<Show when={comments().length > 0}>
					<span><ChatTeardrop /></span>
				</Show>
			</Metadata>
			<Content>{props.entry.content}</Content>
		</Root>
	);
};
