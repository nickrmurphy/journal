import { CheckIcon, XIcon } from "@phosphor-icons/react";
import {
	type ComponentProps,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button, Dialog } from "../../shared";

type CreateEntryDialogProps = ComponentProps<typeof Dialog.Root> & {
	onSubmit: (content: string) => void;
	onClose?: () => void;
};

export function CreateEntryDialog(props: CreateEntryDialogProps) {
	const [content, setContent] = useState("");
	const formRef = useRef<HTMLFormElement | null>(null);

	const handleKeyPress = useCallback(
		(event: KeyboardEvent) => {
			if (!event.metaKey) return;
			if (event.key === "Enter" && content.trim().length > 0) {
				event.preventDefault();
				formRef.current?.requestSubmit();
			}
		},
		[content],
	);

	useEffect(() => {
		// attach the event listener
		document.addEventListener("keydown", handleKeyPress);

		// remove the event listener
		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [handleKeyPress]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		props.onSubmit(content);
	};

	return (
		<Dialog.Root
			{...props}
			onOpenChange={(open) => {
				if (!open) {
					props.onClose?.();
				}
			}}
			onOpenChangeComplete={(open) => {
				props.onOpenChangeComplete?.(open);
				if (!open) {
					setContent("");
				}
			}}
		>
			<Dialog.Content>
				<Dialog.Title className="sr-only">Create Journal Entry</Dialog.Title>
				<form
					id="create-entry-form"
					className="size-full"
					onSubmit={handleSubmit}
					ref={formRef}
				>
					<textarea
						rows={6}
						minLength={1}
						className="size-full focus:outline-none resize-none placeholder:text-lightgray/50"
						placeholder="What's on your mind?"
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
				</form>
				<div className="flex justify-between gap-2">
					<Button
						onClick={props.onClose}
						variant="outline-lightgray"
						size="md-icon"
					>
						<XIcon />
					</Button>
					<Button
						form="create-entry-form"
						variant="solid-yellow"
						size="md-icon"
						type="submit"
						disabled={content.trim().length === 0}
					>
						<CheckIcon />
					</Button>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}
