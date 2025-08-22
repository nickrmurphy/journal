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
				<div key={c.$id} className="flex items-center gap-1.5">
					<ArrowTurnDownRightIcon className="size-4 text-muted-foreground/40" />
					<p className="flex w-full flex-col p-1 text-muted-foreground text-sm">
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
					key={e.$id}
					onClick={() => props.onSelectEntry(e.$id)}
					className="space-y-3 rounded-md border bg-card px-2.5 py-2 text-card-foreground active:brightness-110"
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							props.onSelectEntry(e.$id);
						}
					}}
				>
					<div className="space-y-1.5">
						<h2 className="text-muted-foreground text-xs">
							{formatTime(e.createdAt)}
						</h2>
						<p className="flex h-full items-center whitespace-pre-wrap">
							{e.content}
						</p>
					</div>
					<EntryComments entryId={e.$id} />
				</article>
			))}
		</section>
	);
};
