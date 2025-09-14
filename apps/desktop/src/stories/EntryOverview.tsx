import { ChatTeardropIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import type { Entry } from "./mockData";

export const EntryOverview = (props: { entry: Entry }) => {
	return (
		<article className="cursor-default rounded p-3 text-lightgray/70 transition-all duration-300 hover:bg-darkgray/30 hover:text-lightgray">
			<div className="flex items-center gap-1.5 text-xs">
				<time>{format(new Date(props.entry.createdAt), "h:mm a")}</time>
				<span>
					{props.entry.comments.length > 0 ? <ChatTeardropIcon /> : null}
				</span>
			</div>
			<p className="mt-2 line-clamp-3 text-ellipsis text-sm">
				{props.entry.content}
			</p>
		</article>
	);
};
