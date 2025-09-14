import { PenIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { PocModal } from "../components/PocModal";
import { useModalStore } from "../stores/modalStore";
import { Button } from "./Button";

export function TodayHeader() {
	const now = new Date();
	const { openModal } = useModalStore();
	return (
		<div
			id="today-header"
			className="sticky top-0 z-10 flex items-center rounded-full bg-black/50 outline mx-0.5 outline-darkgray px-2 py-2 shadow-md backdrop-blur"
		>
			<div className="flex items-baseline gap-2 ps-2">
				<h1 className="font-semibold text-lg">{format(now, "MMMM d")}</h1>
				<p className="text-lightgray/70 text-xs">{format(now, "EEEE")}</p>
			</div>
			<div className="ms-auto">
				<Button
					variant="solid-yellow"
					size="md-icon"
					onClick={() =>
						openModal("poc-modal", PocModal, {
							title: "New Entry",
							message: "This modal opened from TodayHeader.",
						})
					}
				>
					<PenIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}
