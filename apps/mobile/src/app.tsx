import { Carousel } from "@ark-ui/react/carousel";
import { useCollections } from "@journal/core/collections";
import type { Entry } from "@journal/core/schemas";
import { EntryCreateDialog, EntryDetailDialog } from "@journal/ui";
import { formatDay, formatMonthDate } from "@journal/utils/dates";
import { useCurrentDate } from "@journal/utils/hooks";
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
		className="backdrop-blur flex items-center justify-between gap-2.5 bg-lightgray/30 rounded-full p-0.5 transition-all w-fit"
	/>
);

const NavItem = (
	props: ComponentProps<typeof Carousel.Indicator> & { label: string },
) => (
	<Carousel.Indicator
		{...props}
		className="transition-all transition-discrete data-[current]:text-yellow data-[current]:bg-black/20 flex items-center gap-1.5 rounded-full [&>svg]:size-4 [&:not([data-current])>[data-part=label]]:hidden px-3.5 py-2.5 active:scale-110"
	>
		{props.children}
		<span data-part="label" className="transition-discrete">
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

const SafeAreaBlur = () => (
	<div className="fixed top-0 h-[env(safe-area-inset-top)] inset-x-0 backdrop-blur-sm z-10 [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]"></div>
);

const TodayHeader = () => {
	const today = useCurrentDate();

	return (
		<span className="flex items-baseline gap-2 py-2 px-3 bg-black/50 backdrop-blur-sm border mx-1 sticky top-[env(safe-area-inset-top)] rounded-full mb-2">
			<span className="font-semibold text-xl text-lightgray/90">
				{formatMonthDate(today)}
			</span>
			<span className="text-sm text-lightgray/70">{formatDay(today)}</span>
		</span>
	);
};

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
				<SafeAreaBlur />
				<Page index={0}>
					<PastEntries onEntryClick={handleEntryClick} />
				</Page>
				<Page index={1}>
					<TodayHeader />
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
					className="size-11 flex items-center bg-yellow/90 text-black rounded-full justify-center active:scale-110 transition-all ms-auto"
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
