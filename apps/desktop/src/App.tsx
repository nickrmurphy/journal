import {
	useEntriesInRange,
	useEntriesOnDate,
	useJournalEntries,
} from "@journal/core/stores/journalEntryStore.js";
import { AsideLayout, Button, EntryList, EntryPreviewList } from "@journal/ui";
import { formatTime } from "@journal/utils/dates";
import { PenIcon } from "@phosphor-icons/react";
import { type ReactNode, useMemo } from "react";

const Container = (props: { children: ReactNode }) => (
	<div className="mx-auto flex w-full max-w-3xl flex-col gap-3" {...props} />
);

const Navbar = () => {
	const add = useJournalEntries((state) => state.addEntry);
	// TODO: Write a useCurrentDateTime hook
	const now = useMemo(() => new Date().toISOString(), []);

	return (
		<nav className="sticky top-0 bg-black/50 rounded-full backdrop-blur flex items-center border p-1.5 pl-3 mx-0.5">
			<time className="font-semibold">{formatTime(now)}</time>
			<Button
				variant="solid-yellow"
				size="md-icon"
				className="ms-auto"
				onClick={() => add({ content: "testing" })}
			>
				<PenIcon />
			</Button>
		</nav>
	);
};

function App() {
	const now = useMemo(() => new Date().toISOString(), []);
	const entries = useEntriesOnDate(now);
	const pastEntries = useEntriesInRange(
		new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
		now,
	);

	return (
		<AsideLayout.Root>
			<AsideLayout.Aside>
				<EntryPreviewList data={pastEntries} />
			</AsideLayout.Aside>
			<AsideLayout.Main>
				<Container>
					<Navbar />
					<EntryList entries={entries} />
				</Container>
			</AsideLayout.Main>
		</AsideLayout.Root>
	);
}

export default App;
