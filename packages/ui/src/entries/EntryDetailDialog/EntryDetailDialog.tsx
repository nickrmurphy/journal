import { Popover } from "@base-ui-components/react/popover";
import { useEntryComments } from "@journal/core/stores/journalEntryStore.js";
import type { JournalEntry, JournalEntryComment } from "@journal/core/types";
import { formatDateTime } from "@journal/utils/dates";
import { ChatTeardropIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "../../shared";
import { button } from "../../shared/Button/Button";
import {
	Dialog,
	dialogBackdrop,
	dialogPopup,
} from "../../shared/Dialog/Dialog";
import { EntryCommentItem } from "../EntryCommentItem/EntryCommentItem";
import { EntryCommentPopover } from "../EntryCommentPopover/EntryCommentPopover";

const Root = ({
	isOpen,
	onClose,
	layoutId,
	children,
}: {
	isOpen: boolean;
	onClose: () => void;
	layoutId: string;
	children: React.ReactNode;
}) => (
	<Dialog.Root open={isOpen} onOpenChange={onClose}>
		<AnimatePresence>
			{isOpen && (
				<Dialog.Portal>
					<Dialog.Backdrop className={dialogBackdrop()} />
					<motion.div
						layoutId={layoutId}
						className={dialogPopup("min-h-1/4 flex flex-col")}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
					>
						{children}
					</motion.div>
				</Dialog.Portal>
			)}
		</AnimatePresence>
	</Dialog.Root>
);

const Timestamp = ({ createdAt }: { createdAt: string }) => (
	<time className="text-lightgray/70 text-sm mb-2">
		{formatDateTime(createdAt)}
	</time>
);

const Comments = ({
	comments,
	entryCreatedAt,
}: {
	comments: JournalEntryComment[];
	entryCreatedAt: string;
}) => (
	<>
		{comments.length > 0 && (
			<div className="mt-4">
				{comments.map((comment) => (
					<EntryCommentItem
						key={comment.id}
						comment={comment}
						showTimestamp={entryCreatedAt}
					/>
				))}
			</div>
		)}
	</>
);

const Actions = ({
	onClose,
	onComment,
}: {
	onClose: () => void;
	onComment?: (comment: string) => void;
}) => {
	const [showCommentPopover, setShowCommentPopover] = useState(false);

	return (
		<div className="justify-between flex items-center w-full">
			<Button onClick={onClose} variant="outline-lightgray" size="md-icon">
				<XIcon />
			</Button>
			<Popover.Root
				open={showCommentPopover}
				onOpenChange={setShowCommentPopover}
			>
				<Popover.Trigger
					disabled={showCommentPopover}
					className={button({ variant: "outline-yellow", size: "md-icon" })}
				>
					<ChatTeardropIcon />
				</Popover.Trigger>
				<EntryCommentPopover
					open={showCommentPopover}
					onClose={() => setShowCommentPopover(false)}
					onSubmit={(comment) => {
						onComment?.(comment);
						setShowCommentPopover(false);
					}}
				/>
			</Popover.Root>
		</div>
	);
};

export const EntryDetailDialog = ({
	isOpen,
	onClose,
	layoutId,
	entry,
	onComment,
}: {
	entry: JournalEntry;
	isOpen: boolean;
	onClose: () => void;
	layoutId: string;
	onComment?: (comment: string) => void;
}) => {
	const comments = useEntryComments(entry.id);

	return (
		<Root isOpen={isOpen} onClose={onClose} layoutId={layoutId}>
			<Dialog.Body>
				<Timestamp createdAt={entry.createdAt} />
				<div>{entry.content}</div>
				<Comments comments={comments} entryCreatedAt={entry.createdAt} />
			</Dialog.Body>
			<Dialog.Footer>
				<Actions onClose={onClose} onComment={onComment} />
			</Dialog.Footer>
		</Root>
	);
};
