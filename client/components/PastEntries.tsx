import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { formatMonthDateYear, formatTime, todayISO } from "../utils/formatDate";
import { useQuery } from "./RepoContext";

type PastEntriesProps = {
	onSelect: (id: string) => void;
};

const DayEntries = (props: {
	date: string;
	onSelect: (id: string) => void;
}) => {
	const data = useQuery((data) =>
		data.filter((entry) => entry.date === props.date),
	);

	return (
		<div className="rounded-md border bg-card p-3 text-card-foreground">
			<h3 className="font-semibold">{formatMonthDateYear(props.date)}</h3>
			<div className="divide-y divide-border/50">
				{data.map((entry) => (
					<article
						key={entry.$id}
						className="space-y-1 py-3 transition-all active:brightness-110"
						onClick={() => props.onSelect(entry.$id)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								props.onSelect(entry.$id);
							}
						}}
					>
						<p className="flex items-center justify-between text-muted-foreground text-xs">
							<time>{formatTime(entry.createdAt)}</time>
							{entry.comments.length > 0 && (
								<span className="flex items-center gap-1.5 p-0.5 px-1">
									{entry.comments.length}
									<ChatBubbleLeftIcon className="size-3" />
								</span>
							)}
						</p>
						<p className="text-muted-foreground text-sm">{entry.content}</p>
					</article>
				))}
			</div>
		</div>
	);
};

export function PastEntries({ onSelect }: PastEntriesProps) {
	const data = useQuery((data) =>
		data.filter((entry) => entry.date < todayISO()),
	);

	return (
		<>
			{data.map((e) => (
				<DayEntries key={e.date} date={e.date} onSelect={onSelect} />
			))}
		</>
	);
}
