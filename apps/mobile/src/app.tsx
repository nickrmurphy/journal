import { Carousel } from "@ark-ui/react/carousel";
import { useCollections } from "@journal/core/collections";
import type { Entry } from "@journal/core/schemas";
import { EntryCreateDialog, EntryDetailDialog } from "@journal/ui";
import {
	BookmarkSimpleIcon,
	ClockCounterClockwiseIcon,
	PenIcon,
	SunHorizonIcon,
} from "@phosphor-icons/react";
import { type ComponentProps, useState } from "react";
import { PastEntries } from "./past-entries";
import { TodayEntries } from "./today-entries";

const NavItems = (props: ComponentProps<typeof Carousel.IndicatorGroup>) => (
	<Carousel.IndicatorGroup
		{...props}
		className="backdrop-blur flex items-center justify-between gap-1.5 bg-lightgray/30 rounded-full p-0.5 transition-all w-fit"
	/>
);

const NavItem = (
	props: ComponentProps<typeof Carousel.Indicator> & { label: string },
) => (
	<Carousel.Indicator
		{...props}
		className="transition-all transition-discrete data-[current]:bg-black/40 flex items-center gap-1.5 rounded-full [&>svg]:size-4 [&:not([data-current])>[data-part=label]]:hidden px-3 py-2 active:scale-110 active:outline-1 active:outline-lightgray/20"
	>
		{props.children}
		<span data-part="label" className="transition-discrete text-sm">
			{props.label}
		</span>
	</Carousel.Indicator>
);

const Page = (props: ComponentProps<typeof Carousel.Item>) => (
	<Carousel.Item
		{...props}
		className="pl-[calc(env(safe-area-inset-left)+0.5rem)] pr-[calc(env(safe-area-inset-right)+0.5rem)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
	/>
);

function App() {
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
				<Page index={0}>
					<PastEntries onEntryClick={handleEntryClick} />
				</Page>
				<Page index={1}>
					<TodayEntries onEntryClick={handleEntryClick} />
				</Page>
				<Page index={2}>Eventually bookmarks and stuff</Page>
			</Carousel.ItemGroup>
			<nav className="flex items-center bottom-[var(--safe-bottom)] fixed inset-x-4">
				<NavItems>
					<NavItem index={0} label="History">
						<ClockCounterClockwiseIcon />
					</NavItem>
					<NavItem index={1} label="Today">
						<SunHorizonIcon />
					</NavItem>
					<NavItem index={2} label="Index">
						<BookmarkSimpleIcon />
					</NavItem>
				</NavItems>
				<button
					type="button"
					className="size-10 flex items-center bg-yellow/90 text-black rounded-full justify-center active:scale-110 transition-all ms-auto"
					onClick={() => setShowCreate(true)}
				>
					<PenIcon className="size-5" />
				</button>
			</nav>
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

export default App;
