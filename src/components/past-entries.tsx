import { isSameDay } from "date-fns";
import { useMemo } from "react";
import { EntryPreviewList } from "@/components/shared";
import { useCurrentDate, useEntries } from "@/hooks";
import type { Entry } from "@/schemas";

export function PastEntries({
	onEntryClick,
}: {
	onEntryClick: (entry: Entry) => void;
}) {
	const today = useCurrentDate();
	const allEntries = useEntries();

	const pastEntries = useMemo(() => {
		if (!allEntries) return [];

		const grouped = allEntries
			.filter((e) => !isSameDay(today, e.createdAt))
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
	}, [allEntries, today]);

	return <EntryPreviewList data={pastEntries} onEntryClick={onEntryClick} />;
}
