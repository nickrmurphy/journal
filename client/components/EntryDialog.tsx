import { Dialog } from "@base-ui-components/react";
import { Transition } from "@headlessui/react";
import {
	ChatBubbleLeftEllipsisIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { useEffect, useMemo, useRef, useState } from "react";
import { entryCollection } from "../collections/entries";
import { entryCommentCollection } from "../collections/entryComments";
import { formatEntryDate } from "../utils/formatDate";
import { Button } from "./Button";
import { DialogContent } from "./DialogContent";

export const EntryDialog = ({ entryId }: { entryId: string | null }) => {
	const [commenting, setCommenting] = useState(false);
	const [comment, setComment] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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

	useEffect(() => {
		if (commenting) {
			textareaRef.current?.focus();
		}
	}, [commenting]);

	if (!entry) {
		// Return empty content to avoid sudden disappearance from dom when closing
		return <DialogContent />;
	}

	return (
		<DialogContent>
			<Dialog.Title className="sr-only">
				Dialog entry for {entry.createdAt}
			</Dialog.Title>
			{/* Scrollable content area with bottom padding to avoid overlap with sticky footer */}
			<div className="space-y-4 overflow-y-scroll pb-12">
				<div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xs rounded-lg p-3 space-y-2  border border-border/50">
					<time className="text-sm text-muted-foreground">
						{formatEntryDate(entry.createdAt)}
					</time>
					<p>{entry.content}</p>
				</div>
				<div className="space-y-2">
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
				</div>
				<Transition
					show={commenting}
					enter="transition ease-out duration-200"
					enterFrom="opacity-0 scale-95 -translate-y-1"
					enterTo="opacity-100 scale-100 translate-y-0"
					leave="transition ease-in duration-150"
					leaveFrom="opacity-100 scale-100 translate-y-0"
					leaveTo="opacity-0 scale-95 -translate-y-1"
				>
					<textarea
						key="comment-textarea"
						ref={textareaRef}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						className="bg-muted/95 mx-0.5 min-h-8 w-full rounded-lg resize-none border outline-none focus:ring focus:ring-accent p-3"
					/>
				</Transition>
			</div>
			{/* Sticky footer */}
			<div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between w-full">
				<Dialog.Close
					render={
						<Button variant="outline" className="shadow-xs">
							<span className="sr-only">Close</span>
							<XMarkIcon />
						</Button>
					}
				/>
				<div className="flex items-center gap-2">
					<Transition
						show={commenting}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 scale-95 -translate-y-1"
						enterTo="opacity-100 scale-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 scale-100 translate-y-0"
						leaveTo="opacity-0 scale-95 -translate-y-1"
					>
						<div key="cancel-btn">
							<Button
								variant="outline"
								className="shadow-xs"
								onClick={() => setCommenting(false)}
							>
								Cancel
							</Button>
						</div>
					</Transition>
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
		</DialogContent>
	);
};
