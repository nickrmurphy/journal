import { Dialog } from "@base-ui-components/react";
import {
	ChatBubbleLeftEllipsisIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { entryCollection } from "../collections/entries";
import { formatEntryDate } from "../utils/formatDate";
import { Button } from "./Button";
import { DialogContent } from "./DialogContent";

export const EntryDialog = ({ entryId }: { entryId: string | null }) => {
	const entry = useMemo(
		() => (entryId ? entryCollection.get(entryId) : null),
		[entryId],
	);

	if (!entry) {
		// Return empty content to avoid sudden disappearance from dom when closing
		return <DialogContent />;
	}

	return (
		<DialogContent>
			<Dialog.Title className="sr-only">
				Dialog entry for {entry.createdAt}
			</Dialog.Title>
			<div className="bg-card rounded-lg p-3 space-y-2">
				<time className="text-sm text-muted-foreground">
					{formatEntryDate(entry.createdAt)}
				</time>
				<p>{entry.content}</p>
			</div>
			<div className="bg-muted text-muted-foreground p-3 rounded-lg space-y-2">
				<h4 className="text-sm">Comments</h4>
				<div className="text-xs pb-2">Reflect on this entry</div>
			</div>
			<div className="mt-auto justify-between flex items-center w-full">
				<Dialog.Close
					render={
						<Button variant="outline" className="shadow-xs">
							<span className="sr-only">Close</span>
							<XMarkIcon />
						</Button>
					}
				/>
				<Button variant="secondary" className="shadow-xs">
					<span className="sr-only">Add Comment</span>
					<ChatBubbleLeftEllipsisIcon />
				</Button>
			</div>
		</DialogContent>
	);
};
