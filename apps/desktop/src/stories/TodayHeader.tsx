import { PenIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { Button } from "./Button";

export function TodayHeader() {
	const now = new Date();
	return (
		<div
			id="today-header"
			className="sticky top-0 z-10 flex items-center rounded-lg bg-black/90 px-4 py-2 shadow-md backdrop-blur"
		>
			<div className="flex items-baseline gap-2">
				<h1 className="font-semibold text-lg">{format(now, "MMMM d")}</h1>
				<p className="text-lightgray/70 text-xs">{format(now, "EEEE")}</p>
			</div>
			<div className="ms-auto">
				<Button variant="solid-yellow" size="md-icon">
					<PenIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}
