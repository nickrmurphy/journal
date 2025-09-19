import type { JournalEntryComment } from "@journal/core/types";
import { formatDateTime, formatDistance } from "@journal/utils/dates";
import { ArrowBendDownRightIcon } from "@phosphor-icons/react";
import { cx } from "cva";
import type { ComponentProps } from "react";
import { Tooltip } from "../../shared";

const Root = (props: ComponentProps<"div"> & { hasTimestamp?: boolean }) => (
	<div
		{...props}
		className={cx(
			props.hasTimestamp ? "flex gap-2 p-2" : "flex items-center gap-2 p-2",
			props.className,
		)}
	>
		<ArrowBendDownRightIcon className="size-4 flex-shrink-0" />
		{props.children}
	</div>
);

const Text = (props: ComponentProps<"p">) => (
	<p
		{...props}
		className={cx("max-w-[55ch] text-lightgray/70 text-sm", props.className)}
	/>
);

const Timestamp = (props: ComponentProps<"time">) => (
	<time
		{...props}
		className={cx("text-lightgray/70 text-xs", props.className)}
	/>
);

const DistanceTimestamp = (
	props: ComponentProps<"time"> & {
		timestamp: string;
	},
) => (
	<Tooltip.Root>
		<Tooltip.Trigger className="">
			<time
				{...props}
				className={cx("text-lightgray/70 text-xs", props.className)}
			/>
		</Tooltip.Trigger>
		<Tooltip.Content>{formatDateTime(props.timestamp)}</Tooltip.Content>
	</Tooltip.Root>
);

export const EntryCommentItem = (props: {
	comment: JournalEntryComment;
	className?: string;
	showTimestamp?: boolean | string;
}) => {
	const { showTimestamp = false } = props;

	return (
		<Root className={props.className} hasTimestamp={!!showTimestamp}>
			<div className="flex flex-col gap-2 pl-1">
				<Text>{props.comment.content}</Text>
				{showTimestamp ? (
					<Timestamp>
						{typeof showTimestamp === "boolean" ? (
							formatDateTime(props.comment.createdAt)
						) : (
							<DistanceTimestamp timestamp={props.comment.createdAt}>
								{formatDistance(props.comment.createdAt, showTimestamp)} later
							</DistanceTimestamp>
						)}
					</Timestamp>
				) : null}
			</div>
		</Root>
	);
};
