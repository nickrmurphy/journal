import { cx } from "cva";
import { For, Show, type ComponentProps } from "solid-js";
import { useEntryComments } from "@/hooks";
import type { Entry } from "@/schemas";
import { formatTime } from "@/utils/dates";
import { EntryCommentItem } from "./entry-comment-item";

const Root = (props: ComponentProps<"article">) => (
	<article
		{...props}
		class={cx(
			"cursor-default bg-black transition-colors rounded-xl p-4 hover:bg-darkgray/30",
			props.class,
		)}
	/>
);

const Time = (props: ComponentProps<"time">) => (
	<time
		{...props}
		class={cx("text-lightgray/70 text-sm", props.class)}
	/>
);

const Content = (props: ComponentProps<"p">) => (
	<p
		{...props}
		class={cx(
			"mt-0.5 max-w-[65ch] text-base text-lightgray leading-relaxed",
			props.class,
		)}
	/>
);

export const EntryItem = (props: { entry: Entry; onClick?: () => void }) => {
	const comments = useEntryComments(() => props.entry.id);

	return (
		<Root onClick={props.onClick}>
			<Time>{formatTime(props.entry.createdAt)}</Time>
			<Content>{props.entry.content}</Content>
			<Show when={comments().length > 0}>
				<div class="mt-1">
					<For each={comments()}>
						{(comment) => (
							<EntryCommentItem comment={comment} />
						)}
					</For>
				</div>
			</Show>
		</Root>
	);
};
