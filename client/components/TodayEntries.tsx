import { eq, useLiveQuery } from "@tanstack/react-db";
import { entryCollection } from "../collections/entries";
import { formatTime, todayISO } from "../utils/formatDate";

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
		<section className="space-y-2">
			{data.map((e) => (
				<article
					key={e.id}
					onClick={() => props.onSelectEntry(e.id)}
					className="text-card-foreground active:brightness-125 border-border/50 border rounded-lg bg-card px-2 py-3 space-y-1"
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							props.onSelectEntry(e.id);
						}
					}}
				>
					<h2 className="text-xs text-muted-foreground">
						{formatTime(e.createdAt)}
					</h2>
					<p>{e.content}</p>
				</article>
			))}
		</section>
	);
};
