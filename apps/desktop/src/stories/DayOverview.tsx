import { format } from "date-fns";
import type { PropsWithChildren } from "react";

type DayOverviewProps = PropsWithChildren<{
	date: string | Date;
}>;

export function DayOverview({ date, children }: DayOverviewProps) {
	const d = typeof date === "string" ? new Date(date) : date;

	return (
		<div className="w-full rounded border bg-black p-1 shadow">
			<h2 className="flex items-baseline gap-1.5 px-1.5 pt-2 pb-1">
				<span className="text-sm">{format(d, "EEE d")}</span>
				<span className="text-lightgray/70 text-xs">{format(d, "MMM")}</span>
			</h2>
			{children}
		</div>
	);
}
