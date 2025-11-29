import { Dialog } from "@ark-ui/solid/dialog";
import { Send, X } from "lucide-solid";
import { type ComponentProps, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { Button, Textarea } from "@/components/ui";

export const TextareaDialog = (
	props: ComponentProps<typeof Dialog.Root> & {
		onSubmit: (content: string) => void;
		onCancel: () => void;
	},
) => {
	const [content, setContent] = createSignal("");

	return (
		<Dialog.Root
			{...props}
			onExitComplete={() => {
				setContent("");
				props.onExitComplete?.();
			}}
		>
			<Portal>
				<Dialog.Backdrop class="fixed inset-0 bg-black/70 transition-all backdrop-blur-xs" />
				<Dialog.Positioner class="z-50 fixed inset-0 flex items-end justify-center p-2 pb-[calc(var(--floating-input-height)+8px)]">
					<Dialog.Content class="w-full max-w-2xl flex items-center gap-2 z-50">
						<Textarea
							autofocus
							class="w-full bg-white/10 backdrop-blur-3xl p-2 rounded-xl shadow border"
							rows={4}
							value={content()}
							onInput={(e) => setContent(e.currentTarget.value)}
						/>
						<div class="flex flex-col gap-2">
							<Button
								type="button"
								variant="outline-lightgray"
								class="min-w-11 min-h-11 mt-auto shadow"
								onClick={() => props.onCancel()}
							>
								<X />
							</Button>
							<Button
								type="button"
								variant="solid-yellow"
								class="min-w-11 min-h-11 mt-auto shadow"
								onClick={() => props.onSubmit(content())}
							>
								<Send />
							</Button>
						</div>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
