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
import { Textarea } from "./Textarea";

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
			isBookmarked: false,
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
					as="form"
					transition
					className="fixed flex flex-col gap-3 top-0 inset-x-0 translate-y-0 shadow-xl bg-background/90 backdrop-blur-xs text-foreground p-3 min-h-1/3 max-h-2/3 overflow-y-scroll border-b rounded-b-xl transition-transform duration-300 ease-out data-[closed]:-translate-y-full data-[enter]:ease-out data-[leave]:ease-in"
					onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}
				>
					<DialogTitle className="sr-only">Create a new entry</DialogTitle>
					<Textarea
						autoFocus
						required
						minLength={1}
						placeholder="What's on your mind?"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<div className="flex justify-between gap-4 shrink-0">
						<Button
							type="button"
							className="shadow-xs"
							variant="outline"
							onClick={() => {
								setInputValue("");
								onOpenChange(false);
							}}
						>
							<XMarkIcon />
						</Button>
						<Button type="submit" className="shadow-xs" disabled={!inputValue}>
							<CheckIcon />
						</Button>
					</div>
				</DialogPanel>
			</div>
		</Dialog>
	);
};
