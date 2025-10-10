import { Carousel } from "@ark-ui/react/carousel";
import { useCollections } from "@journal/core/collections";
import type { Entry } from "@journal/core/schemas";
import { PenIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Page } from "@/components/page";
import { PastEntries } from "@/components/past-entries";
import { SafeAreaBlur } from "@/components/safe-area-blur";
import { TextareaDialog } from "@/components/textarea-dialog";
import { TodayEntries } from "@/components/today-entries";
import { TodayHeader } from "@/components/today-header";
import { EntryDetailDialog } from "../components/entry-detail";

type DialogMode =
	| { type: "none" }
	| { type: "create-entry" }
	| { type: "view-entry"; entry: Entry }
	| { type: "add-comment"; entry: Entry };

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [dialogMode, setDialogMode] = useState<DialogMode>({ type: "none" });
	const { entriesCollection, commentsCollection } = useCollections();

	const handleEntryClick = useCallback((entry: Entry) => {
		setDialogMode({ type: "view-entry", entry });
	}, []);

	const handleCreateEntry = useCallback(
		(content: string) => {
			entriesCollection.insert({ content });
			setDialogMode({ type: "none" });
		},
		[entriesCollection],
	);

	const handleAddComment = useCallback(
		(content: string) => {
			if (dialogMode.type !== "add-comment") return;

			commentsCollection.insert({
				entryId: dialogMode.entry.id,
				content,
			});
			setDialogMode({ type: "view-entry", entry: dialogMode.entry });
		},
		[dialogMode, commentsCollection],
	);

	const handleCommentButtonClick = useCallback(() => {
		if (dialogMode.type === "view-entry") {
			setDialogMode({ type: "add-comment", entry: dialogMode.entry });
		}
	}, [dialogMode]);

	const handleCloseDialog = useCallback(() => {
		setDialogMode({ type: "none" });
	}, []);

	return (
		<Carousel.Root defaultPage={1} slideCount={3}>
			<Carousel.ItemGroup className="fixed inset-0">
				<SafeAreaBlur />
				<Page as={Carousel.Item} index={0}>
					<PastEntries onEntryClick={handleEntryClick} />
				</Page>
				<Page as={Carousel.Item} index={1}>
					<TodayHeader />
					<TodayEntries onEntryClick={handleEntryClick} />
				</Page>
				<Page as={Carousel.Item} index={2}>
					Eventually bookmarks and stuff
				</Page>
			</Carousel.ItemGroup>
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
		</Carousel.Root>
	);
}
