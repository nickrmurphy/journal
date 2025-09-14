import { ArrowBendDownRightIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import type { Entry } from "./mockData";

export const EntryItem = (props: { entry: Entry }) => {
	return (
		<article className="cursor-default rounded p-4 transition-all duration-300 hover:bg-darkgray/30">
			<time className="text-lightgray/70 text-sm">
				{format(new Date(props.entry.createdAt), "h:mm a")}
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
