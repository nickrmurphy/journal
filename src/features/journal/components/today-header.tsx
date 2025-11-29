import { createDateNow } from "@/lib/primitives";
import { formatDay, formatMonthDate } from "@/lib/utils/dates";

export const TodayHeader = () => {
	const today = createDateNow();

	return (
		<span class="flex items-baseline gap-2 py-2 mx-0.5 px-3 bg-white/10 backdrop-blur-sm sticky top-[var(--safe-top)] rounded-xl mb-2">
			<span class="font-semibold text-xl">
				{formatMonthDate(today().toISOString())}
			</span>
			<span class="text-sm">{formatDay(today().toISOString())}</span>
		</span>
	);
};
