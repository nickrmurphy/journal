import { Dialog } from "@base-ui-components/react";
import {
	ChatBubbleLeftEllipsisIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { entryCollection } from "../collections/entries";
import { entryCommentCollection } from "../collections/entryComments";
import { formatEntryDate } from "../utils/formatDate";
import { Button } from "./Button";
import { DialogContent } from "./DialogContent";

export const EntryDialog = ({ entryId }: { entryId: string | null }) => {
	const [commenting, setCommenting] = useState(false);
	const [comment, setComment] = useState("");
	const entry = useMemo(
		() => (entryId ? entryCollection.get(entryId) : null),
		[entryId],
	);
	const { data: comments } = useLiveQuery(
		(q) =>
			q
				.from({ comments: entryCommentCollection })
				.where(({ comments }) => eq(comments.entryId, entryId)),
		[entryId],
	);

	const handleCommentSubmit = () => {
		if (!entryId) return;
		console.log("submitting");

		const tx = entryCommentCollection.insert({
			id: crypto.randomUUID(),
			entryId,
			content: comment,
			createdAt: new Date().toISOString(),
		});

		tx.isPersisted.promise.then(() => {
			setComment("");
			setCommenting(false);
		});
	};

	if (!entry) {
		// Return empty content to avoid sudden disappearance from dom when closing
		return <DialogContent />;
	}

	return (
		<DialogContent>
			<Dialog.Title className="sr-only">
				Dialog entry for {entry.createdAt}
			</Dialog.Title>
			{/* Layout: flex column full height so footer stays at bottom */}
			<div className="flex flex-col min-h-[min(66vh,600px)] max-h-[66vh]">
				<div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-4 pb-4">
					<div className="bg-card rounded-lg p-3 space-y-2 shadow-sm border border-border/50">
						<time className="text-sm text-muted-foreground">
							{formatEntryDate(entry.createdAt)}
						</time>
						<p>{entry.content}</p>
					</div>
					<motion.div layout className="space-y-2">
						{comments.map((comment) => (
							<div
								key={comment.id}
								className="p-3 rounded-lg bg-muted text-muted-foreground space-y-1"
							>
								<time className="text-xs text-muted-foreground">
									{formatEntryDate(comment.createdAt)}
								</time>
								<p className="text-sm">{comment.content}</p>
							</div>
						))}
					</motion.div>
					<AnimatePresence initial={false} mode="popLayout">
						{commenting && (
							<motion.textarea
								key="comment-textarea"
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="bg-muted/90 min-h-8 w-full rounded-lg resize-none border outline-none focus:ring focus:ring-accent p-3"
								initial={{ opacity: 0, scale: 0.9, y: -4 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: -4 }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 24,
									mass: 0.4,
								}}
								autoFocus
							/>
						)}
					</AnimatePresence>
				</div>
				{/* Footer */}
				<div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
					<Dialog.Close
						render={
							<Button variant="outline" className="shadow-xs">
								<span className="sr-only">Close</span>
								<XMarkIcon />
							</Button>
						}
					/>
					<div className="flex items-center gap-2">
						<AnimatePresence initial={false}>
							{commenting && (
								<motion.div
									key="cancel-btn"
									initial={{ opacity: 0, scale: 0.9, y: -4 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.9, y: -4 }}
									transition={{
										type: "spring",
										stiffness: 300,
										damping: 24,
										mass: 0.4,
									}}
									layout
								>
									<Button
										variant="outline"
										className="shadow-xs"
										onClick={() => setCommenting(false)}
									>
										Cancel
									</Button>
								</motion.div>
							)}
						</AnimatePresence>
						<Button
							variant="secondary"
							className="shadow-xs"
							disabled={commenting && !comment}
							onClick={() => {
								if (commenting) {
									handleCommentSubmit();
								} else {
									setCommenting(true);
								}
							}}
						>
							<span className="sr-only">Add Comment</span>
							{!commenting && <ChatBubbleLeftEllipsisIcon />}
							{commenting && <CheckIcon />}
						</Button>
					</div>
				</div>
			</div>
		</DialogContent>
	);
};
