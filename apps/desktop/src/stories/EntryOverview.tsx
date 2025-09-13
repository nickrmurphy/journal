import { ChatTeardropIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import type { Entry } from "./mockData";

export const EntryOverview = (props: { entry: Entry }) => {
	return (
		<article className="p-3 hover:bg-darkgray/30 cursor-default rounded transition-all duration-300 text-lightgray/70 hover:text-lightgray">
			<div className="text-xs flex items-center gap-1.5">
				<time>{format(new Date(props.entry.createdAt), "h:mm a")}</time>
				<span>
					{props.entry.comments.length > 0 ? <ChatTeardropIcon /> : null}
				</span>
			</div>
			<p className="mt-2 text-sm line-clamp-3 text-ellipsis">
				{props.entry.content}
			</p>
		</article>
	);
};
