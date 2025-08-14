import { eq, useLiveQuery } from "@tanstack/react-db";
import { AnimatePresence, motion } from "motion/react";
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
		<motion.section layout className="space-y-2">
			<AnimatePresence initial={false} mode="popLayout">
				{data.map((e) => (
					<motion.article
						key={e.id}
						layout
						initial={{ opacity: 0, y: -16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -16 }}
						transition={{
							type: "spring",
							stiffness: 320,
							damping: 28,
						}}
						onClick={() => props.onSelectEntry(e.id)}
						whileTap={{ filter: "brightness(1.25)" }}
						className="text-card-foreground border-border/50 border rounded-lg bg-card px-2 py-3 space-y-1"
					>
						<h2 className="text-xs text-muted-foreground">
							{formatTime(e.createdAt)}
						</h2>
						<p>{e.content}</p>
					</motion.article>
				))}
			</AnimatePresence>
		</motion.section>
	);
};
