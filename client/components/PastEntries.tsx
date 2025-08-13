import { eq, lt, useLiveQuery } from "@tanstack/react-db";
import { AnimatePresence, motion } from "motion/react";
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
		<motion.div className="bg-card text-card-foreground rounded-lg p-3">
			<motion.h3 layout className="font-medium">
				{formatMonthDateYear(props.date)}
			</motion.h3>
			<div className="divide-y">
				{data.map((entry) => (
					<motion.div
						key={entry.id}
						className="py-3 space-y-1 rounded-md"
						onClick={() => props.onSelect(entry.id)}
						whileTap={{
							filter: "brightness(1.25)",
						}}
					>
						<p>
							<time className="text-xs text-muted-foreground">
								{formatTime(entry.createdAt)}
							</time>
						</p>
						<p className="text-sm text-muted-foreground">{entry.content}</p>
					</motion.div>
				))}
			</div>
		</motion.div>
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

	console.log(data);

	return (
		<motion.section layout className="space-y-2">
			<AnimatePresence initial={false} mode="popLayout">
				{data.map((e) => (
					<DayEntries key={e.date} date={e.date} onSelect={onSelect} />
				))}
			</AnimatePresence>
		</motion.section>
	);
}
