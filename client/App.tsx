import { Dialog } from "@base-ui-components/react";
import { type FC, type PropsWithChildren, useState } from "react";
import { CreateEntryDialog } from "./components/CreateEntryDialog";
import { EntryDialog } from "./components/EntryDialog";
import { PastEntries } from "./components/PastEntries";
import { Subheader } from "./components/Subheader";
import { TodayEntries } from "./components/TodayEntries";
import { TodayHeader } from "./components/TodayHeader";

const Nav = () => (
	<div className="flex justify-end fixed bottom-[calc(var(--safe-bottom)+var(--spacing)*4)] inset-x-4">
		<CreateEntryDialog />
	</div>
);

const Page: FC<PropsWithChildren> = ({ children }) => (
	<main className="bg-background w-[calc(100%-theme(spacing.4))] gap-5 flex flex-col rounded-xl shadow flex-1 m-auto min-h-[calc(100vh-theme(spacing.4))] my-2 p-2 overflow-auto pb-20">
		{children}
	</main>
);

function App() {
	const [detailId, setDetailId] = useState<string | null>(null);

	return (
		<Page>
			<section>
				<TodayHeader />
				<TodayEntries onSelectEntry={setDetailId} />
			</section>
			<section className="space-y-2">
				<Subheader>Previously</Subheader>
				<PastEntries onSelect={setDetailId} />
			</section>
			<Nav />
			<Dialog.Root
				open={detailId !== null}
				onOpenChange={() => {
					setDetailId(null);
				}}
			>
				<EntryDialog entryId={detailId} />
			</Dialog.Root>
		</Page>
	);
}

export default App;
