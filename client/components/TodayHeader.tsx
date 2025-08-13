import { todayDay } from "../utils/formatDate";
import { Header } from "./Header";

export function TodayHeader() {
	return (
		<header className="p-2 mb-2 space-y-0.5">
			<p className="text-muted-foreground text-sm font-serif ">{todayDay()}</p>
			<Header />
		</header>
	);
}
