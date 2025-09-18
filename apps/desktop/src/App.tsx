import {
	useEntriesInRange,
	useEntriesOnDate,
	useJournalEntries,
} from "@journal/core/stores/journalEntryStore.js";
import {
	AsideLayout,
	Button,
	CreateEntryDialog,
	EntryList,
	EntryPreviewList,
} from "@journal/ui";
import { useCurrentDate } from "@journal/utils/hooks";
import { PenIcon } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import {
	formatDay,
	formatMonthDate,
} from "../../../packages/utils/src/dates/format";

const Container = (props: { children: ReactNode }) => (
	<div className="mx-auto flex w-full max-w-3xl flex-col gap-3" {...props} />
);

const Navbar = () => {
	const add = useJournalEntries((state) => state.addEntry);
	const today = useCurrentDate();
	const [showDialog, setShowDialog] = useState(false);

	return (
		<>
			<nav className="sticky top-0 bg-black/50 rounded-full backdrop-blur flex items-center border p-1.5 pl-3 mx-0.5">
				<span className="flex items-baseline gap-2.5">
					<span className="font-semibold">{formatMonthDate(today)}</span>
					<span className="text-sm text-lightgray/70">{formatDay(today)}</span>
				</span>

				<Button
					variant="solid-yellow"
					size="md-icon"
					className="ms-auto"
					onClick={() => setShowDialog(true)}
				>
					<PenIcon />
				</Button>
			</nav>
			<CreateEntryDialog
				open={showDialog}
				onClose={() => setShowDialog(false)}
				onSubmit={(content) => {
					add({ content });
					setShowDialog(false);
				}}
			/>
		</>
	);
};

function App() {
	const today = useCurrentDate();
	const entries = useEntriesOnDate(today);
	const pastEntries = useEntriesInRange(new Date(0).toISOString(), today);

	return (
		<AsideLayout.Root>
			<AsideLayout.Aside>
				<EntryPreviewList data={pastEntries} />
			</AsideLayout.Aside>
			<AsideLayout.Main>
				<Container>
					<Navbar />
					<EntryList entries={entries.toReversed()} />
				</Container>
			</AsideLayout.Main>
		</AsideLayout.Root>
	);
}

export default App;
