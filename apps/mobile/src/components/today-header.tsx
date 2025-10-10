import { formatDay, formatMonthDate } from "@journal/utils/dates";
import { useCurrentDate } from "@journal/utils/hooks";

export const TodayHeader = () => {
	const today = useCurrentDate();

	return (
		<span className="flex items-baseline gap-2 py-2 px-3 bg-black/90 backdrop-blur-sm border sticky top-[env(safe-area-inset-top)] rounded-2xl mb-2">
			<span className="font-semibold text-xl text-lightgray/90">
				{formatMonthDate(today)}
			</span>
			<span className="text-sm text-lightgray/70">{formatDay(today)}</span>
		</span>
	);
};
