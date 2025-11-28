import { Pen } from "lucide-solid";
import { createSignal, onMount } from "solid-js";
import { EntryDetailDialog } from "@/components/entries";
import { Page, SafeAreaBlur } from "@/components/layout";
import { PastEntries, TodayEntries, TodayHeader } from "@/components/pages";
import { TextareaDialog } from "@/components/ui";
import { db } from "@/database";
import type { Entry } from "@/schemas";

type DialogMode =
	| { type: "none" }
	| { type: "create-entry" }
	| { type: "view-entry"; entry: Entry }
	| { type: "add-comment"; entry: Entry };

export const JournalRoute = () => {
	const [dialogMode, setDialogMode] = createSignal<DialogMode>({
		type: "none",
	});
	let scrollContainerRef: HTMLDivElement | undefined;

	const handleEntryClick = (entry: Entry) => {
		setDialogMode({ type: "view-entry", entry });
	};

	const handleCreateEntry = (content: string) => {
		db.entries.add({ content });
		setDialogMode({ type: "none" });
	};

	const handleAddComment = (content: string) => {
		const mode = dialogMode();
		if (mode.type !== "add-comment") return;

		db.comments.add({
			entryId: mode.entry.id,
			content,
		});
		setDialogMode({ type: "view-entry", entry: mode.entry });
	};

	const handleCommentButtonClick = () => {
		const mode = dialogMode();
		if (mode.type === "view-entry") {
			setDialogMode({ type: "add-comment", entry: mode.entry });
		}
	};

	const handleCloseDialog = () => {
		setDialogMode({ type: "none" });
	};

	// Scroll to Today page (second section) on mount
	onMount(() => {
		if (scrollContainerRef) {
			const viewportWidth = window.innerWidth;
			scrollContainerRef.scrollTo({
				left: viewportWidth,
				behavior: "instant",
			});
		}
	});

	return (
		<>
			<div
				ref={scrollContainerRef}
				class="fixed inset-0 overflow-x-scroll overflow-y-hidden snap-x snap-mandatory"
				style={{ "scrollbar-width": "none", "-ms-overflow-style": "none" }}
			>
				<div class="flex h-full">
					<SafeAreaBlur />
					<section class="w-screen h-screen flex-shrink-0 snap-start overflow-y-auto pb-14">
						<Page>
							<PastEntries onEntryClick={handleEntryClick} />
						</Page>
					</section>
					<section class="w-screen h-screen flex-shrink-0 snap-start overflow-y-auto pb-14">
						<Page>
							<TodayHeader />
							<TodayEntries onEntryClick={handleEntryClick} />
						</Page>
					</section>
				</div>
			</div>
			<div class="flex items-center bottom-[var(--safe-bottom)] fixed right-4">
				<button
					type="button"
					class="size-11 flex items-center bg-yellow/90 text-black rounded-full justify-center active:scale-110 transition-all ms-auto"
					onClick={() => setDialogMode({ type: "create-entry" })}
				>
					<Pen class="size-5" />
				</button>
			</div>
			<TextareaDialog
				open={dialogMode().type === "create-entry"}
				onOpenChange={(e) => {
					if (!e.open) setDialogMode({ type: "none" });
				}}
				onSubmit={handleCreateEntry}
				onCancel={handleCloseDialog}
			/>
			<TextareaDialog
				open={dialogMode().type === "add-comment"}
				onOpenChange={(e) => {
					const mode = dialogMode();
					if (!e.open && mode.type === "add-comment") {
						setDialogMode({ type: "view-entry", entry: mode.entry });
					}
				}}
				onSubmit={handleAddComment}
				onCancel={() => {
					const mode = dialogMode();
					if (mode.type === "add-comment") {
						setDialogMode({ type: "view-entry", entry: mode.entry });
					}
				}}
			/>
			<EntryDetailDialog
				entry={
					dialogMode().type === "view-entry" ||
					dialogMode().type === "add-comment"
						? (dialogMode() as { entry: Entry }).entry
						: undefined
				}
				isOpen={
					dialogMode().type === "view-entry" ||
					dialogMode().type === "add-comment"
				}
				onClose={handleCloseDialog}
				onExitComplete={handleCloseDialog}
				onComment={handleCommentButtonClick}
			/>
		</>
	);
};
