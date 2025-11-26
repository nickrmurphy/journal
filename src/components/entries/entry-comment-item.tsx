import { ArrowBendDownRightIcon } from "@phosphor-icons/react";
import { cx } from "cva";
import type { Comment } from "@/schemas";
import { formatDateTime, formatDistance } from "@/utils/dates";
import { Tooltip } from "../ui";

export const EntryCommentItem = (props: {
	comment: Comment;
	className?: string;
	showTimestamp?: boolean | string;
}) => {
	const { showTimestamp = false } = props;
	const hasTimestamp = !!showTimestamp;

	return (
		<div
			className={cx(
				hasTimestamp ? "flex gap-2 p-2" : "flex items-center gap-2 p-2",
				props.className,
			)}
		>
			<ArrowBendDownRightIcon className="size-4 flex-shrink-0" />
			<div className="flex flex-col gap-2 pl-1">
				<p className="max-w-[55ch] text-lightgray/70 text-sm">
					{props.comment.content}
				</p>
				{showTimestamp ? (
					<time className="text-lightgray/70 text-xs">
						{typeof showTimestamp === "boolean" ? (
							formatDateTime(props.comment.createdAt)
						) : (
							<Tooltip.Root>
								<Tooltip.Trigger asChild>
									<time className="text-lightgray/70 text-xs">
										{formatDistance(props.comment.createdAt, showTimestamp)}{" "}
										later
									</time>
								</Tooltip.Trigger>
								<Tooltip.Content>
									{formatDateTime(props.comment.createdAt)}
								</Tooltip.Content>
							</Tooltip.Root>
						)}
					</time>
				) : null}
			</div>
		</div>
	);
};
