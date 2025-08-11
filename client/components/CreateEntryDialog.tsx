import { Dialog } from "@base-ui-components/react/dialog";
import {
	CheckIcon,
	PencilSquareIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { entryCollection } from "../collections/entries";
import { Button } from "./Button";
import { DialogContent } from "./DialogContent";

export const CreateEntryDialog = () => {
	const [inputValue, setInputValue] = useState("");
	const [open, setOpen] = useState(false);

	const handleSave = () => {
		entryCollection.insert({
			id: crypto.randomUUID(),
			content: inputValue,
			createdAt: new Date().toISOString(),
		});
		setInputValue("");
		setOpen(false);
	};

	return (
		<Dialog.Root
			open={open}
			onOpenChange={(open) => {
				if (!open) {
					setInputValue("");
				}
				setOpen(open);
			}}
		>
			<Dialog.Trigger
				render={
					<Button size="lg">
						<PencilSquareIcon />
					</Button>
				}
			/>
			<DialogContent>
				<Dialog.Title className="sr-only">Create a new entry</Dialog.Title>
				<textarea
					minLength={1}
					required
					className="h-full resize-none border rounded-lg p-3 outline-none focus:ring focus:ring-accent/50"
					placeholder="What's on your mind?"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<div className="flex justify-between gap-4 mt-auto">
					<Dialog.Close
						render={
							<Button className="shadow-xs" variant="outline">
								<XMarkIcon />
							</Button>
						}
					/>
					<Dialog.Close
						render={
							<Button
								className="shadow-xs"
								disabled={!inputValue}
								onClick={handleSave}
							>
								<CheckIcon />
							</Button>
						}
					/>
				</div>
			</DialogContent>
		</Dialog.Root>
	);
};
