import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { count, eq, lt, useLiveQuery } from "@tanstack/react-db";
import { entryCollection } from "../collections/entries";
import { entryCommentCollection } from "../collections/entryComments";
import { formatMonthDateYear, formatTime, todayISO } from "../utils/formatDate";

type PastEntriesProps = {
	onSelect: (id: string) => void;
};

const DayEntries = (props: {
	date: string;
	onSelect: (id: string) => void;
}) => {
	const { data } = useLiveQuery((q) => {
		const comments = q
			.from({ comments: entryCommentCollection })
			.groupBy(({ comments }) => comments.entryId)
			.select(({ comments }) => ({
				entryId: comments.entryId,
				count: count(comments.id),
			}));

		return q
			.from({ entries: entryCollection })
			.where(({ entries }) => eq(entries.date, props.date))
			.leftJoin({ comments }, ({ entries, comments }) =>
				eq(entries.id, comments.entryId),
			)
			.orderBy(({ entries }) => entries.createdAt, "desc")
			.select(({ entries, comments }) => ({
				...entries,
				commentCount: comments.count,
			}));
	});

	return (
		<div className="bg-card text-card-foreground rounded-md p-3 border">
			<h3 className="font-medium">{formatMonthDateYear(props.date)}</h3>
			<div className="divide-y divide-border/50">
				{data.map((entry) => (
					<article
						key={entry.id}
						className="py-3 space-y-1 active:brightness-110 transition-all"
						onClick={() => props.onSelect(entry.id)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								props.onSelect(entry.id);
							}
						}}
					>
						<p className="text-xs flex items-center text-muted-foreground justify-between">
							<time>{formatTime(entry.createdAt)}</time>
							{entry.commentCount && (
								<span className="flex items-center gap-1.5 p-0.5 px-1">
									{entry.commentCount}
									<ChatBubbleLeftIcon className="size-3" />
								</span>
							)}
						</p>
						<p className="text-sm text-muted-foreground">{entry.content}</p>
					</article>
				))}
			</div>
		</div>
	);
};

export function PastEntries({ onSelect }: PastEntriesProps) {
	const { data } = useLiveQuery((q) =>
		q
			.from({ entries: entryCollection })
			.where(({ entries }) => lt(entries.date, todayISO()))
			.orderBy(({ entries }) => entries.date, "desc")
			.select(({ entries }) => ({ date: entries.date }))
			.distinct(),
	);

	return (
		<>
			{data.map((e) => (
				<DayEntries key={e.date} date={e.date} onSelect={onSelect} />
			))}
		</>
	);
}
