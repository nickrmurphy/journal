import { Carousel } from "@ark-ui/react/carousel";
import { useCollections } from "@journal/core/collections";
import type { Entry } from "@journal/core/schemas";
import { EntryCreateDialog, EntryDetailDialog } from "@journal/ui";
import { PenIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/page";
import { PastEntries } from "@/components/past-entries";
import { SafeAreaBlur } from "@/components/safe-area-blur";
import { TodayEntries } from "@/components/today-entries";
import { TodayHeader } from "@/components/today-header";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [showCreate, setShowCreate] = useState(false);
	const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { entriesCollection, commentsCollection } = useCollections();

	const handleEntryClick = (entry: Entry) => {
		setSelectedEntry(entry);
		setIsDialogOpen(true);
	};

	const handleComment = (content: string) => {
		if (selectedEntry) {
			commentsCollection.insert({
				entryId: selectedEntry.id,
				content,
			});
		}
	};

	return (
		<Carousel.Root defaultPage={1} slideCount={2}>
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
					onClick={() => setShowCreate(true)}
				>
					<PenIcon className="size-5" />
				</button>
			</div>
			<EntryCreateDialog
				open={showCreate}
				onClose={() => setShowCreate(false)}
				onSubmit={(content) => {
					entriesCollection.insert({ content });
					setShowCreate(false);
				}}
			/>
			<EntryDetailDialog
				entry={selectedEntry || undefined}
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onExitComplete={() => setSelectedEntry(null)}
				onComment={handleComment}
			/>
		</Carousel.Root>
	);
}
