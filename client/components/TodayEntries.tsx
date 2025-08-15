import {
	ArrowDownRightIcon,
	ArrowTurnDownRightIcon,
	ArrowTurnLeftUpIcon,
	ArrowTurnRightDownIcon,
	ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { entryCollection } from "../collections/entries";
import { entryCommentCollection } from "../collections/entryComments";
import { formatTime, todayISO } from "../utils/formatDate";

const EntryComments = (props: { entryId: string }) => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ comments: entryCommentCollection })
			.where(({ comments }) => eq(comments.entryId, props.entryId)),
	);

	return data.length > 0 ? (
		<div className="px-1 flex flex-col gap-3">
			{data.map((c) => (
				<div key={c.id} className="flex gap-1.5 items-start pl-10">
					<ArrowTurnDownRightIcon className="size-3 text-muted-foreground/40 mt-2 mb-auto min-w-3" />
					<p className="text-sm text-muted-foreground flex flex-col border border-muted px-2.5 py-2 rounded-lg mr-auto min-w-2/3">
						{c.content}
					</p>
					{/* <ChatBubbleLeftIcon className="size-3 text-muted-foreground/40 mt-auto mb-1 min-w-3" /> */}
				</div>
			))}
		</div>
	) : null;
};

export const TodayEntries = (props: {
	onSelectEntry: (id: string) => void;
}) => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ entries: entryCollection })
			.orderBy((e) => e.entries.createdAt, "desc")
			.where(({ entries }) => eq(entries.date, todayISO())),
	);

	return (
		<section className="space-y-4">
			{data.map((e) => (
				<article
					key={e.id}
					onClick={() => props.onSelectEntry(e.id)}
					className=" active:bg-muted active:brightness-110 space-y-3"
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							props.onSelectEntry(e.id);
						}
					}}
				>
					<div className="space-y-1.5">
						<h2 className="text-xs text-muted-foreground px-1">
							{formatTime(e.createdAt)}
						</h2>
						<p className="rounded-lg bg-card text-card-foreground border px-2.5 py-2 mr-10 h-full flex items-center">
							{e.content}
						</p>
					</div>
					<EntryComments entryId={e.id} />
				</article>
			))}
		</section>
	);
};
