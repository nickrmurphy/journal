import type { JournalEntry } from "@journal/core/types";
import { formatTime } from "@journal/utils/dates";
import { ArrowBendDownRightIcon } from "@phosphor-icons/react";

export const EntryItem = (props: { entry: JournalEntry }) => {
	return (
		<article className="cursor-default bg-black rounded p-4 transition-all duration-300 hover:bg-black/70">
			<time className="text-lightgray/70 text-sm">
				{formatTime(props.entry.createdAt)}
			</time>
			<p className="mt-0.5 max-w-[65ch] text-base text-lightgray leading-relaxed">
				{props.entry.content}
			</p>
			<div className="mt-1">
				{props.entry.comments.map((comment) => (
					<div key={comment.createdAt} className="flex items-center gap-2 p-2">
						<ArrowBendDownRightIcon className="size-4" />
						<p className="max-w-[55ch] text-lightgray/70 text-sm">
							{comment.content}
						</p>
					</div>
				))}
			</div>
		</article>
	);
};
