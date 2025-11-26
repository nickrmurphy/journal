import { useEntryComments } from "@/hooks";
import type { Entry } from "@/schemas";
import { formatTime } from "@/utils/dates";
import { EntryCommentItem } from "./entry-comment-item";

export const EntryItem = (props: { entry: Entry; onClick?: () => void }) => {
	const comments = useEntryComments(props.entry.id);

	return (
		<article
			onClick={props.onClick}
			className="cursor-default bg-black transition-colors rounded-xl p-4 hover:bg-darkgray/30"
		>
			<time className="text-lightgray/70 text-sm">
				{formatTime(props.entry.createdAt)}
			</time>
			<p className="mt-0.5 max-w-[65ch] text-base text-lightgray leading-relaxed">
				{props.entry.content}
			</p>
			{comments.length > 0 && (
				<div className="mt-1">
					{comments.map((comment) => (
						<EntryCommentItem key={comment.id} comment={comment} />
					))}
				</div>
			)}
		</article>
	);
};
