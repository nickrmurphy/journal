import { PenIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Button } from "./Button";
import { EntryItem } from "./EntryItem";
import { EntryOverview } from "./EntryOverview";
import { mockStore } from "./mockData";

export const HomePage = () => {
	return (
		<div className="fixed inset-0 grid grid-cols-6">
			{/* Past Entries Bar */}
			<section className="divide-y flex flex-col overflow-y-auto py-3 space-y-6 col-span-2 p-3">
				{Object.entries(mockStore.pastEntries).map(([date, entries]) => (
					<div key={date} className="p-1 border rounded bg-black w-full shadow">
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
			</section>
			<main className="overflow-y-auto p-3 flex flex-col col-span-4">
				{/* centered inner container so content auto-centers in remaining space */}
				<div className="w-full max-w-3xl mx-auto flex flex-col">
					<div
						id="today-header"
						className="sticky top-0 shadow-md z-10 flex bg-black/90 items-center backdrop-blur py-2 px-4 rounded-lg"
					>
						<div className="flex items-baseline gap-2 ">
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
					<div
						id="today-entries"
						className="border rounded p-1.5 mt-3 bg-black shadow"
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
