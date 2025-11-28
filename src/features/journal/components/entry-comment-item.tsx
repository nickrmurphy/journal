import { cx } from "cva";
import { CornerDownRight } from "lucide-solid";
import { createMemo, Show } from "solid-js";
import { Tooltip } from "@/components/ui";
import type { Comment } from "@/lib/db";
import { formatDateTime, formatDistance } from "@/lib/utils/dates";

export const EntryCommentItem = (props: {
	comment: Comment;
	class?: string;
	showTimestamp?: boolean | string;
}) => {
	const showTimestamp = () => props.showTimestamp ?? false;
	const hasTimestamp = createMemo(() => !!showTimestamp());

	return (
		<div
			class={cx(
				hasTimestamp() ? "flex gap-2 p-2" : "flex items-center gap-2 p-2",
				props.class,
			)}
		>
			<CornerDownRight class="size-4 flex-shrink-0" />
			<div class="flex flex-col gap-2 pl-1">
				<p class="max-w-[55ch] text-lightgray/70 text-sm">
					{props.comment.content}
				</p>
				<Show when={showTimestamp()}>
					<time class="text-lightgray/70 text-xs">
						<Show
							when={typeof showTimestamp() === "string"}
							fallback={formatDateTime(props.comment.createdAt)}
						>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<time class="text-lightgray/70 text-xs">
										{formatDistance(
											props.comment.createdAt,
											showTimestamp() as string,
										)}{" "}
										later
									</time>
								</Tooltip.Trigger>
								<Tooltip.Content>
									{formatDateTime(props.comment.createdAt)}
								</Tooltip.Content>
							</Tooltip.Root>
						</Show>
					</time>
				</Show>
			</div>
		</div>
	);
};
