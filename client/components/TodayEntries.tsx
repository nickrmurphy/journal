import autoAnimate from "@formkit/auto-animate";
import { ArrowTurnDownRightIcon } from "@heroicons/react/24/outline";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { useEffect, useRef } from "react";
import { entryCollection } from "../collections/entries";
import { entryCommentCollection } from "../collections/entryComments";
import { formatTime, todayISO } from "../utils/formatDate";

const EntryComments = (props: { entryId: string }) => {
	const parent = useRef(null);

	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, []);

	const { data } = useLiveQuery((q) =>
		q
			.from({ comments: entryCommentCollection })
			.where(({ comments }) => eq(comments.entryId, props.entryId)),
	);

	return data.length > 0 ? (
		<div className="space-y-2" ref={parent}>
			{data.map((c) => (
				<div key={c.id} className="flex gap-1.5 items-center">
					<ArrowTurnDownRightIcon className="size-4 text-muted-foreground/40" />
					<p className="text-sm text-muted-foreground flex flex-col p-1 w-full">
						{c.content}
					</p>
				</div>
			))}
		</div>
	) : null;
};

export const TodayEntries = (props: {
	onSelectEntry: (id: string) => void;
}) => {
	const parent = useRef(null);

	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, []);

	const { data } = useLiveQuery((q) =>
		q
			.from({ entries: entryCollection })
			.orderBy((e) => e.entries.createdAt, "desc")
			.where(({ entries }) => eq(entries.date, todayISO())),
	);

	return (
		<section className="space-y-3" ref={parent}>
			{data.map((e) => (
				<article
					key={e.id}
					onClick={() => props.onSelectEntry(e.id)}
					className="rounded-md px-2.5 py-2 bg-card border active:brightness-110 space-y-3 text-card-foreground"
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							props.onSelectEntry(e.id);
						}
					}}
				>
					<div className="space-y-1.5">
						<h2 className="text-xs text-muted-foreground">
							{formatTime(e.createdAt)}
						</h2>
						<p className="h-full flex items-center whitespace-pre-wrap">
							{e.content}
						</p>
					</div>
					<EntryComments entryId={e.id} />
				</article>
			))}
		</section>
	);
};
