import { useEntryComments } from "@journal/core/stores/journalEntryStore.js";
import type { JournalEntry, JournalEntryComment } from "@journal/core/types";
import { formatDateTime } from "@journal/utils/dates";
import { ChatTeardropIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../../shared";
import { Dialog } from "../../shared/Dialog/Dialog";
import { Popover } from "../../shared/Popover/Popover";
import { EntryCommentItem } from "../EntryCommentItem/EntryCommentItem";
import { EntryCommentPopover } from "../EntryCommentPopover/EntryCommentPopover";

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
				onOpenChange={(details) => setShowCommentPopover(details.open)}
				positioning={{
					placement: "bottom-end",
					offset: { mainAxis: 8 },
				}}
			>
				<Popover.Trigger disabled={showCommentPopover} asChild>
					<Button variant="outline-yellow" size="md-icon">
						<ChatTeardropIcon />
					</Button>
				</Popover.Trigger>
				<EntryCommentPopover
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
	entry,
	onExitComplete,
	onComment,
}: {
	entry: JournalEntry | undefined;
	isOpen: boolean;
	onClose: () => void;
	onExitComplete?: () => void;
	onComment?: (comment: string) => void;
}) => {
	const comments = useEntryComments(entry?.id ?? "");

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={onClose}
			onExitComplete={onExitComplete}
		>
			<Dialog.Content>
				<Dialog.Body>
					{entry && (
						<>
							<Timestamp createdAt={entry.createdAt} />
							<div>{entry.content}</div>
							<Comments comments={comments} entryCreatedAt={entry.createdAt} />
						</>
					)}
				</Dialog.Body>
				{entry && (
					<Dialog.Footer>
						<Actions onClose={onClose} onComment={onComment} />
					</Dialog.Footer>
				)}
			</Dialog.Content>
		</Dialog.Root>
	);
};
