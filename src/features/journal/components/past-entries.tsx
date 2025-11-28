import { isSameDay } from "date-fns";
import { createMemo } from "solid-js";
import type { Entry } from "@/lib/db";
import { useCurrentDate } from "@/lib/hooks";
import { useEntries } from "../hooks";
import { EntryPreviewList } from "./entry-preview-list";

export function PastEntries(props: { onEntryClick: (entry: Entry) => void }) {
	const today = useCurrentDate();
	const allEntries = useEntries();

	const pastEntries = createMemo(() => {
		const entries = allEntries();
		if (!entries) return [];

		const grouped = entries
			.filter((e) => !isSameDay(today(), e.createdAt))
			.reduce(
				(acc, entry) => {
					// biome-ignore lint/style/noNonNullAssertion: <always defined>
					const date = entry.createdAt.split("T")[0]!;
					if (!acc[date]) {
						acc[date] = [];
					}
					acc[date].push({
						id: entry.id,
						content: entry.content,
						createdAt: entry.createdAt,
					});
					return acc;
				},
				{} as Record<
					string,
					{ id: string; content: string; createdAt: string }[]
				>,
			);

		return Object.entries(grouped).map(([date, entries]) => ({
			date,
			entries,
		}));
	});

	return (
		<EntryPreviewList data={pastEntries()} onEntryClick={props.onEntryClick} />
	);
}
