import { Collapsible, Dialog } from "@base-ui-components/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { type FC, type PropsWithChildren, useState } from "react";
import { Button } from "./components/Button";
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
				<Collapsible.Root defaultOpen>
					<div className="flex items-center justify-between">
						<Subheader>Previously</Subheader>
						<Collapsible.Trigger
							render={
								<Button variant="ghost" className="aria-expanded:rotate-180" />
							}
						>
							<ChevronUpIcon />
						</Collapsible.Trigger>
					</div>
					<Collapsible.Panel>
						<AnimatePresence mode="wait">
							<motion.section
								key="past-entries"
								layout
								className="space-y-2"
								exit={{ opacity: 0, height: 0 }}
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 24,
									mass: 0.4,
								}}
							>
								<PastEntries onSelect={setDetailId} />
							</motion.section>
						</AnimatePresence>
					</Collapsible.Panel>
				</Collapsible.Root>
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
