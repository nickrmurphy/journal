import { ArrowBendDownRight } from "solid-phosphor";
import { cx } from "cva";
import { Show, type ComponentProps } from "solid-js";
import type { Comment } from "@/schemas";
import { formatDateTime, formatDistance } from "@/utils/dates";
import { Tooltip } from "../ui";

const Root = (props: ComponentProps<"div"> & { hasTimestamp?: boolean }) => {
	const { hasTimestamp, ...domProps } = props;
	return (
		<div
			{...domProps}
			class={cx(
				hasTimestamp ? "flex gap-2 p-2" : "flex items-center gap-2 p-2",
				props.class,
			)}
		>
			<ArrowBendDownRight class="size-4 flex-shrink-0" />
			{props.children}
		</div>
	);
};

const Text = (props: ComponentProps<"p">) => (
	<p
		{...props}
		class={cx("max-w-[55ch] text-lightgray/70 text-sm", props.class)}
	/>
);

const Timestamp = (props: ComponentProps<"time">) => (
	<time
		{...props}
		class={cx("text-lightgray/70 text-xs", props.class)}
	/>
);

const DistanceTimestamp = (
	props: ComponentProps<"time"> & {
		timestamp: string;
	},
) => (
	<Tooltip.Root>
		<Tooltip.Trigger>
			<time
				{...props}
				class={cx("text-lightgray/70 text-xs", props.class)}
			/>
		</Tooltip.Trigger>
		<Tooltip.Content>{formatDateTime(props.timestamp)}</Tooltip.Content>
	</Tooltip.Root>
);

export const EntryCommentItem = (props: {
	comment: Comment;
	class?: string;
	showTimestamp?: boolean | string;
}) => {
	const showTimestamp = () => props.showTimestamp || false;

	return (
		<Root class={props.class} hasTimestamp={!!showTimestamp()}>
			<div class="flex flex-col gap-2 pl-1">
				<Text>{props.comment.content}</Text>
				<Show when={showTimestamp()}>
					<Timestamp>
						{typeof showTimestamp() === "boolean" ? (
							formatDateTime(props.comment.createdAt)
						) : (
							<DistanceTimestamp timestamp={props.comment.createdAt}>
								{formatDistance(props.comment.createdAt, showTimestamp() as string)} later
							</DistanceTimestamp>
						)}
					</Timestamp>
				</Show>
			</div>
		</Root>
	);
};
