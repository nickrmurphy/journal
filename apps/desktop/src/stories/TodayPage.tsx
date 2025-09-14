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
			<section className="col-span-2 flex flex-col space-y-6 divide-y overflow-y-auto p-3 py-3">
				{Object.entries(mockStore.pastEntries).map(([date, entries]) => (
					<div key={date} className="w-full rounded border bg-black p-1 shadow">
						<h2 className="flex items-baseline gap-1.5 px-1.5 pt-2 pb-1">
							<span className="text-sm">{format(new Date(date), "EEE d")}</span>
							<span className="text-lightgray/70 text-xs">
								{format(new Date(date), "MMM")}
							</span>
						</h2>
						{entries.map((entry) => (
							<EntryOverview key={entry.createdAt} entry={entry} />
						))}
					</div>
				))}
			</section>
			<main className="col-span-4 flex flex-col overflow-y-auto p-3">
				{/* centered inner container so content auto-centers in remaining space */}
				<div className="mx-auto flex w-full max-w-3xl flex-col">
					<div
						id="today-header"
						className="sticky top-0 z-10 flex items-center rounded-lg bg-black/90 px-4 py-2 shadow-md backdrop-blur"
					>
						<div className="flex items-baseline gap-2">
							<h1 className="font-semibold text-lg">
								{format(new Date(), "MMMM d")}
							</h1>
							<p className="text-lightgray/70 text-xs">
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
