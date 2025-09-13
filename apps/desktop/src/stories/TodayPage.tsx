import { format } from "date-fns";
import { EntryItem } from "./EntryItem";
import { EntryOverview } from "./EntryOverview";
import { mockStore } from "./mockData";

export const HomePage = () => {
	return (
		<>
			{/* Past Entries Bar */}
			<nav className="fixed w-xs inset-y-0 left-0 divide-y flex flex-col overflow-y-auto p-3 space-y-3">
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
			<main className="fixed left-[var(--container-xs)] right-0 inset-y-0 p-3 overflow-y-auto flex flex-col gap-3">
				<div className="flex items-baseline gap-2">
					<h1 className="text-lg font-semibold">
						{format(new Date(), "MMMM d")}
					</h1>
					<p className="text-xs text-lightgray/70">
						{format(new Date(), "EEEE")}
					</p>
				</div>
				<div
					data-slot="today-entries"
					className="border rounded size-full p-1.5"
				>
					{mockStore.todayEntries.map((entry) => (
						<EntryItem key={entry.createdAt} entry={entry} />
					))}
				</div>
			</main>
		</>
	);
};
