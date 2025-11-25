import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { Button, Textarea } from "@journal/ui";
import { PaperPlaneIcon, XIcon } from "@phosphor-icons/react";

import { type ComponentProps, useState } from "react";

// TODO: move to @journal/ui
export const TextareaDialog = (
	props: ComponentProps<typeof Dialog.Root> & {
		onSubmit: (content: string) => void;
		onCancel: () => void;
	},
) => {
	const [content, setContent] = useState("");

	return (
		<Dialog.Root
			{...props}
			onExitComplete={() => {
				setContent("");
				props.onExitComplete?.();
			}}
		>
			<Portal>
				<Dialog.Backdrop className="fixed inset-0 bg-black/50" />
				<Dialog.Positioner className="z-50 fixed inset-0 flex items-end justify-center p-2 pb-[calc(var(--floating-input-height)+8px)]">
					<Dialog.Content className="w-full max-w-2xl flex items-center gap-2 z-50">
						<Textarea
							autoFocus
							className="w-full bg-black p-2 rounded-xl shadow border"
							rows={4}
							value={content}
							onChange={(e) => setContent(e.currentTarget.value)}
						/>
						<div className="flex flex-col gap-2">
							<Button
								type="button"
								variant="outline-lightgray"
								className="min-w-11 min-h-11 mt-auto shadow"
								onClick={() => props.onCancel()}
							>
								<XIcon />
							</Button>
							<Button
								type="button"
								variant="solid-yellow"
								className="min-w-11 min-h-11 mt-auto shadow"
								onClick={() => props.onSubmit(content)}
							>
								<PaperPlaneIcon />
							</Button>
						</div>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
