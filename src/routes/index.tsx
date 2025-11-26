import { PenIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Page, SafeAreaBlur } from "@/components/layout";
import {
	EntryDetailDialog,
	PastEntries,
	TextareaDialog,
	TodayEntries,
	TodayHeader,
} from "@/components/pages";
import { db } from "@/database";
import type { Entry } from "@/schemas";

type DialogMode =
	| { type: "none" }
	| { type: "create-entry" }
	| { type: "view-entry"; entry: Entry }
	| { type: "add-comment"; entry: Entry };

export const JournalRoute = () => {
	const [dialogMode, setDialogMode] = useState<DialogMode>({ type: "none" });
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleEntryClick = useCallback((entry: Entry) => {
		setDialogMode({ type: "view-entry", entry });
	}, []);

	const handleCreateEntry = useCallback((content: string) => {
		db.entries.add({ content });
		setDialogMode({ type: "none" });
	}, []);

	const handleAddComment = useCallback(
		(content: string) => {
			if (dialogMode.type !== "add-comment") return;

			db.comments.add({
				entryId: dialogMode.entry.id,
				content,
			});
			setDialogMode({ type: "view-entry", entry: dialogMode.entry });
		},
		[dialogMode],
	);

	const handleCommentButtonClick = useCallback(() => {
		if (dialogMode.type === "view-entry") {
			setDialogMode({ type: "add-comment", entry: dialogMode.entry });
		}
	}, [dialogMode]);

	const handleCloseDialog = useCallback(() => {
		setDialogMode({ type: "none" });
	}, []);

	// Scroll to Today page (second section) on mount
	useEffect(() => {
		if (scrollContainerRef.current) {
			const viewportWidth = window.innerWidth;
			scrollContainerRef.current.scrollTo({
				left: viewportWidth,
				behavior: "instant",
			});
		}
	}, []);

	return (
		<>
			<div
				ref={scrollContainerRef}
				className="fixed inset-0 overflow-x-scroll overflow-y-hidden snap-x snap-mandatory"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				<div className="flex h-full">
					<SafeAreaBlur />
					<section className="w-screen h-screen flex-shrink-0 snap-start overflow-y-auto pb-14">
						<Page>
							<PastEntries onEntryClick={handleEntryClick} />
						</Page>
					</section>
					<section className="w-screen h-screen flex-shrink-0 snap-start overflow-y-auto pb-14">
						<Page>
							<TodayHeader />
							<TodayEntries onEntryClick={handleEntryClick} />
						</Page>
					</section>
				</div>
			</div>
			<div className="flex items-center bottom-[var(--safe-bottom)] fixed right-4">
				<button
					type="button"
					className="size-11 flex items-center bg-yellow/90 text-black rounded-full justify-center active:scale-110 transition-all ms-auto"
					onClick={() => setDialogMode({ type: "create-entry" })}
				>
					<PenIcon className="size-5" />
				</button>
			</div>
			<TextareaDialog
				open={dialogMode.type === "create-entry"}
				onOpenChange={(e) => {
					if (!e.open) setDialogMode({ type: "none" });
				}}
				onSubmit={handleCreateEntry}
				onCancel={handleCloseDialog}
			/>
			<TextareaDialog
				open={dialogMode.type === "add-comment"}
				onOpenChange={(e) => {
					if (!e.open && dialogMode.type === "add-comment") {
						setDialogMode({ type: "view-entry", entry: dialogMode.entry });
					}
				}}
				onSubmit={handleAddComment}
				onCancel={() => {
					if (dialogMode.type === "add-comment") {
						setDialogMode({ type: "view-entry", entry: dialogMode.entry });
					}
				}}
			/>
			<EntryDetailDialog
				entry={
					dialogMode.type === "view-entry" || dialogMode.type === "add-comment"
						? dialogMode.entry
						: undefined
				}
				isOpen={
					dialogMode.type === "view-entry" || dialogMode.type === "add-comment"
				}
				onClose={handleCloseDialog}
				onExitComplete={handleCloseDialog}
				onComment={handleCommentButtonClick}
			/>
		</>
	);
};
