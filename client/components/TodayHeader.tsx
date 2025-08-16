import { todayDay, todayMonthDate } from "../utils/formatDate";
import { Header } from "./Header";

export function TodayHeader() {
	return (
		<header className="">
			<Header>{todayMonthDate()}</Header>
			<p className="text-muted-foreground text-sm font-medium">{todayDay()}</p>
		</header>
	);
}
