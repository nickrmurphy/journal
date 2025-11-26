import { format } from "date-fns";
import type { JSX } from "solid-js";

type EntryDateCardProps = {
	date: string;
	children: JSX.Element;
};

export function EntryDateCard(props: EntryDateCardProps) {
	const d = () => new Date(props.date);

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
