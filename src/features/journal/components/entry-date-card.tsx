import { format } from "date-fns";
import type { ParentProps } from "solid-js";
import { createMemo } from "solid-js";

type EntryDateCardProps = ParentProps<{
	date: string;
}>;

export function EntryDateCard(props: EntryDateCardProps) {
	const d = createMemo(() => new Date(props.date));

	return (
		<div class="w-full rounded-xl bg-black p-1">
			<h2 class="flex items-baseline gap-1.5 px-1.5 pt-2 pb-1">
				<span class="text-sm">{format(d(), "EEE d")}</span>
				<span class="text-lightgray/70 text-xs">{format(d(), "MMM")}</span>
			</h2>
			<div>{props.children}</div>
		</div>
	);
}
