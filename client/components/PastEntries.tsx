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
			.where(({ entries }) => eq(entries.date, props.date)),
	);

	return (
		<div className="bg-card text-card-foreground rounded-lg p-3">
			<h3 className="font-medium">{formatMonthDateYear(props.date)}</h3>
			<div className="divide-y">
				{data.map((entry) => (
					<button
						type="button"
						key={entry.id}
						className="py-3 space-y-1 active:brightness-125 transition-all"
						onClick={() => props.onSelect(entry.id)}
					>
						<p>
							<time className="text-xs text-muted-foreground">
								{formatTime(entry.createdAt)}
							</time>
						</p>
						<p className="text-sm text-muted-foreground">{entry.content}</p>
					</button>
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
