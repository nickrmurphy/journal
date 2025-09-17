import { useJournalEntries } from "@journal/core/stores/journalEntryStore.js";
import { AsideLayout, Button, EntryList } from "@journal/ui";
import { PenIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

const Container = (props: { children: ReactNode }) => (
	<div className="mx-auto flex w-full max-w-3xl flex-col gap-3" {...props} />
);

const Navbar = () => {
	const add = useJournalEntries((state) => state.addEntry);

	return (
		<nav className="sticky top-0 bg-black/50 rounded-full backdrop-blur flex items-center border p-1.5 pl-3 mx-0.5">
			Date
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
	const entries = useJournalEntries((state) => state.entries);

	return (
		<AsideLayout.Root>
			<AsideLayout.Aside>
				<div>Past stuff goes here</div>
			</AsideLayout.Aside>
			<AsideLayout.Main>
				<Container>
					<Navbar />
					<EntryList entries={Object.values(entries)} />
				</Container>
			</AsideLayout.Main>
		</AsideLayout.Root>
	);
}

export default App;
