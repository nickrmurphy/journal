import { Dialog } from "@base-ui-components/react/dialog";
import {
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { entryCollection } from "../collections/entries";
import { Button } from "./Button";

export const CreateEntryDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
	const [inputValue, setInputValue] = useState("");

	const handleSave = () => {
		entryCollection.insert({
			id: crypto.randomUUID(),
			content: inputValue,
			createdAt: new Date().toISOString(),
			date: new Date().toISOString().split("T")[0],
		});
		setInputValue("");
		onOpenChange(false);
	};

	if (!open) {
		return null;
	}

	return (
		<Dialog.Portal>
			<Dialog.Backdrop className="fixed inset-0 bg-black opacity-30 transition-opacity duration-200 sm:flex sm:justify-center data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 dark:opacity-70" />
			<Dialog.Popup className="fixed flex flex-col gap-3 top-0 inset-x-0 translate-y-0 shadow-xl bg-background/90 backdrop-blur-xs text-foreground p-3 min-h-1/3 max-h-2/3 overflow-y-scroll border-b rounded-b-xl transition-transform duration-300 ease-out data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full">
				<Dialog.Title className="sr-only">Create a new entry</Dialog.Title>
				{/* Flex parent provided by DialogContent (Popup) already uses flex-col; make textarea grow */}
				<textarea
					minLength={1}
					required
					className="flex-1 min-h-0 w-full resize-none border rounded-lg p-3 outline-none focus:ring focus:ring-accent/50 overflow-y-auto"
					placeholder="What's on your mind?"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<div className="flex justify-between gap-4 shrink-0">
					<Dialog.Close
						render={
							<Button className="shadow-xs" variant="outline" onClick={() => {
								setInputValue("");
								onOpenChange(false);
							}}>
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
	);
};
