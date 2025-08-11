import { Dialog } from "@base-ui-components/react/dialog";
import {
	CheckIcon,
	PencilSquareIcon,
	XMarkIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";
import { entryCollection } from "../collections/entries";
import { Button } from "./Button";

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
			<Dialog.Portal>
				<Dialog.Backdrop className="fixed inset-0 bg-black opacity-30 transition-opacity duration-200 sm:flex sm:justify-center data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 dark:opacity-70" />
				<Dialog.Popup className="fixed flex flex-col gap-3 top-3 inset-x-3 translate-y-0 bg-background/90 backdrop-blur-xs text-foreground p-3 h-1/3 border-b rounded-xl transition-transform duration-300 ease-out data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full dark:outline-gray-300">
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
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
