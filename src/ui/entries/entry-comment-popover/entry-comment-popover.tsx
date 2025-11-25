import { CheckIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, Popover, Textarea } from "../../shared";

interface EntryCommentPopoverProps {
	onClose: () => void;
	onSubmit?: (comment: string) => void;
}

export const EntryCommentPopover = ({
	onClose,
	onSubmit,
}: EntryCommentPopoverProps) => {
	const [comment, setComment] = useState("");

	const handleSubmit = () => {
		if (comment.trim()) {
			onSubmit?.(comment.trim());
			setComment("");
		}
	};

	const handleCancel = () => {
		setComment("");
		onClose();
	};

	return (
		<Popover.Content className="flex items-center gap-2 min-w-[30ch]">
			<Textarea
				className="w-full pr-2 border-r mr-0 border-dashed text-sm"
				rows={4}
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder="What's on your mind?"
			/>
			<div className="flex flex-col justify-between h-[6rem]">
				<Button
					variant="outline-lightgray"
					size="md-icon"
					onClick={handleCancel}
				>
					<XIcon />
				</Button>
				<Button
					variant="solid-yellow"
					size="md-icon"
					onClick={handleSubmit}
					disabled={!comment.trim()}
				>
					<CheckIcon />
				</Button>
			</div>
		</Popover.Content>
	);
};
