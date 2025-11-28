import { useCurrentDate } from "@/hooks";
import { formatDay, formatMonthDate } from "@/utils/dates";

export const TodayHeader = () => {
	const today = useCurrentDate();

	return (
		<span class="flex items-baseline gap-2 py-2 mx-0.5 px-3 bg-black/90 backdrop-blur-sm border sticky top-[var(--safe-top)] rounded-2xl mb-2">
			<span class="font-semibold text-xl text-lightgray/90">
				{formatMonthDate(today())}
			</span>
			<span class="text-sm text-lightgray/70">{formatDay(today())}</span>
		</span>
	);
};
