import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { entryCollection } from "../collections/entries";
import { Button } from "./Button";

export const CreateEntryDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
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

	return (
		<Dialog
			open={open}
			onClose={() => onOpenChange(false)}
			className="relative z-10"
		>
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-black opacity-30 transition-opacity duration-200 sm:flex sm:justify-center data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:opacity-70"
			/>
			<div className="fixed inset-0 z-10 w-screen">
				<DialogPanel
					transition
					className="fixed flex flex-col gap-3 top-0 inset-x-0 translate-y-0 shadow-xl bg-background/90 backdrop-blur-xs text-foreground p-3 min-h-1/3 max-h-2/3 overflow-y-scroll border-b rounded-b-xl transition-transform duration-300 ease-out data-[closed]:-translate-y-full data-[enter]:ease-out data-[leave]:ease-in"
				>
					<DialogTitle className="sr-only">Create a new entry</DialogTitle>
					{/* Flex parent provided by DialogContent (Panel) already uses flex-col; make textarea grow */}
					<textarea
						minLength={1}
						required
						className="flex-1 min-h-0 w-full resize-none border rounded-lg p-3 outline-none focus:ring focus:ring-accent/50 overflow-y-auto"
						placeholder="What's on your mind?"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<div className="flex justify-between gap-4 shrink-0">
						<Button
							className="shadow-xs"
							variant="outline"
							onClick={() => {
								setInputValue("");
								onOpenChange(false);
							}}
						>
							<XMarkIcon />
						</Button>
						<Button
							className="shadow-xs"
							disabled={!inputValue}
							onClick={handleSave}
						>
							<CheckIcon />
						</Button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
