import { ArrowBendDownRightIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import type { Entry } from "./mockData";

export const EntryItem = (props: { entry: Entry }) => {
	return (
		<article className="rounded hover:bg-darkgray/30 p-4 transition-all duration-300 cursor-default">
			<time className="text-sm text-lightgray/70">
				{format(new Date(props.entry.createdAt), "h:mm a")}
			</time>
			<p className="mt-0.5 text-base text-lightgray max-w-[65ch] leading-relaxed">
				{props.entry.content}
			</p>
			<div className="mt-1">
				{props.entry.comments.map((comment, i) => (
					<div key={i} className="flex items-center gap-2 p-2">
						<ArrowBendDownRightIcon className="size-4" />
						<p className="text-sm text-lightgray/70 max-w-[55ch]">
							{comment.content}
						</p>
					</div>
				))}
			</div>
		</article>
	);
};
