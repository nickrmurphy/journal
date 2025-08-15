import { eq, lt, useLiveQuery } from "@tanstack/react-db";
import { entryCollection } from "../collections/entries";
import { formatMonthDateYear, formatTime, todayISO } from "../utils/formatDate";

type PastEntriesProps = {
	onSelect: (id: string) => void;
};

const DayEntries = (props: {
	date: string;
	onSelect: (id: string) => void;
}) => {
	const { data } = useLiveQuery((q) =>
		q
			.from({ entries: entryCollection })
			.where(({ entries }) => eq(entries.date, props.date))
			.orderBy(({ entries }) => entries.createdAt, "desc"),
	);

	return (
		<div className="bg-card text-card-foreground rounded-lg p-3 border">
			<h3 className="font-medium">{formatMonthDateYear(props.date)}</h3>
			<div className="divide-y">
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
						<p>
							<time className="text-xs text-muted-foreground">
								{formatTime(entry.createdAt)}
							</time>
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
