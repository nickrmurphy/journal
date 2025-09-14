import { DayOverview } from "./DayOverview";
import { EntryItem } from "./EntryItem";
import { EntryOverview } from "./EntryOverview";
import { mockStore } from "./mockData";
import { TodayHeader } from "./TodayHeader";

export const HomePage = () => {
	return (
		<div className="fixed inset-0 grid grid-cols-6">
			{/* Past Entries Bar */}
			<aside className="col-span-2 flex flex-col space-y-6 divide-y overflow-y-auto p-3 py-3">
				{Object.entries(mockStore.pastEntries).map(([date, entries]) => (
					<DayOverview key={date} date={date}>
						{entries.map((entry) => (
							<EntryOverview key={entry.createdAt} entry={entry} />
						))}
					</DayOverview>
				))}
			</aside>
			<main className="col-span-4 flex flex-col overflow-y-auto p-3">
				{/* centered inner container so content auto-centers in remaining space */}
				<div className="mx-auto flex w-full max-w-3xl flex-col">
					<TodayHeader />
					<div
						id="today-entries"
						className="mt-3 rounded border bg-black p-1.5 shadow"
					>
						{mockStore.todayEntries.map((entry) => (
							<EntryItem key={entry.createdAt} entry={entry} />
						))}
					</div>
				</div>
			</main>
		</div>
	);
};
