import { PenIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Button } from "./Button";
import { EntryItem } from "./EntryItem";
import { EntryOverview } from "./EntryOverview";
import { mockStore } from "./mockData";

export const HomePage = () => {
	return (
		<>
			{/* Past Entries Bar */}
			<nav className="fixed w-xs inset-y-0 left-0 divide-y flex flex-col overflow-y-auto p-3 space-y-6">
				{Object.entries(mockStore.pastEntries).map(([date, entries], i) => (
					<div key={date} className="p-1 border rounded">
						<h2 className="px-1.5 pt-2 pb-1 flex gap-1.5 items-baseline">
							<span className="text-sm">{format(new Date(date), "EEE d")}</span>
							<span className="text-xs text-lightgray/70">
								{format(new Date(date), "MMM")}
							</span>
						</h2>
						{entries.map((entry) => (
							<EntryOverview key={entry.createdAt} entry={entry} />
						))}
					</div>
				))}
			</nav>
			<main className="fixed left-[var(--container-xs)] right-0 inset-y-0 pt-3 pb-3 px-3 overflow-y-auto flex flex-col max-w-3xl">
				<div
					id="today-header"
					className="sticky -mx-1 top-0 z-10 flex items-center backdrop-blur py-2 px-4 rounded-full border"
				>
					<div className="flex items-baseline gap-2">
						<h1 className="text-lg font-semibold">
							{format(new Date(), "MMMM d")}
						</h1>
						<p className="text-xs text-lightgray/70">
							{format(new Date(), "EEEE")}
						</p>
					</div>
					<div className="ms-auto">
						<Button variant="solid-yellow" size="md-icon">
							<PenIcon className="size-4" />
						</Button>
					</div>
				</div>
				<div id="today-entries" className="border rounded p-1.5 mt-3">
					{mockStore.todayEntries.map((entry) => (
						<EntryItem key={entry.createdAt} entry={entry} />
					))}
				</div>
			</main>
		</>
	);
};
