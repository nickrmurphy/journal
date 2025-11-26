import { format } from "date-fns";
import type { PropsWithChildren } from "react";

type EntryDateCardProps = PropsWithChildren<{
	date: string;
}>;

export function EntryDateCard({ date, children }: EntryDateCardProps) {
	const d = new Date(date);

	return (
		<div className="w-full rounded-xl bg-black p-1">
			<h2 className="flex items-baseline gap-1.5 px-1.5 pt-2 pb-1">
				<span className="text-sm">{format(d, "EEE d")}</span>
				<span className="text-lightgray/70 text-xs">{format(d, "MMM")}</span>
			</h2>
			<div>{children}</div>
		</div>
	);
}
