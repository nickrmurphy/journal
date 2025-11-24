import { useEntryComments } from "@journal/core/hooks";
import type { Comment, Entry } from "@journal/core/schemas";
import { Button, Drawer, EntryCommentItem } from "@journal/ui";
import { formatDateTime } from "@journal/utils/dates";
import { ChatTeardropIcon, XIcon } from "@phosphor-icons/react";

const Timestamp = ({ createdAt }: { createdAt: string }) => (
	<time className="text-lightgray/70 text-sm mb-2">
		{formatDateTime(createdAt)}
	</time>
);

const Comments = ({
	comments,
	entryCreatedAt,
}: {
	comments: Comment[];
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
	onComment: () => void;
}) => {
	return (
		<div className="justify-between flex items-center w-full">
			<Button onClick={onClose} variant="outline-lightgray" size="md-icon">
				<XIcon />
			</Button>
			<Button variant="outline-yellow" size="md-icon" onClick={onComment}>
				<ChatTeardropIcon />
			</Button>
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
	entry: Entry | undefined;
	isOpen: boolean;
	onClose: () => void;
	onExitComplete?: () => void;
	onComment: () => void;
}) => {
	const { data: comments } = useEntryComments(entry?.id ?? "");

	return (
		<Drawer.Root
			open={isOpen}
			onOpenChange={onClose}
			onExitComplete={onExitComplete}
		>
			<Drawer.Content>
				{entry && (
					<Drawer.Toolbar>
						<Actions onClose={onClose} onComment={onComment} />
					</Drawer.Toolbar>
				)}
				<Drawer.Body>
					{entry && (
						<>
							<Timestamp createdAt={entry.createdAt} />
							<div>{entry.content}</div>
							<Comments comments={comments} entryCreatedAt={entry.createdAt} />
						</>
					)}
				</Drawer.Body>
			</Drawer.Content>
		</Drawer.Root>
	);
};
