// Format: Sun Aug 10 8:33PM
// Assumes input is always an ISO datetime string (UTC or with offset).
const dtf = new Intl.DateTimeFormat("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
	hour12: true,
});

export function formatEntryDate(iso: string): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "Invalid Date";
	const parts = dtf.formatToParts(d);
	let weekday = "",
		month = "",
		day = "",
		hour = "",
		minute = "",
		period = "";
	for (const { type, value } of parts) {
		if (type === "weekday") weekday = value;
		else if (type === "month") month = value;
		else if (type === "day") day = value;
		else if (type === "hour") hour = value;
		else if (type === "minute") minute = value;
		else if (type === "dayPeriod") period = value;
	}
	return `${weekday} ${month} ${day} ${hour}:${minute}${period}`;
}
