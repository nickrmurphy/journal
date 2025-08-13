import { format } from "date-fns";

// Format: Sun Aug 10 8:33PM
export function formatEntryDate(iso: string): string {
	const d = new Date(iso);
	return format(d, "EEE MMM d h:mma");
}

// Get today's date in ISO format (YYYY-MM-DD)
export function todayISO() {
	return new Date().toISOString().split("T")[0];
}

export function formatMonthDateYear(iso: string): string {
	const d = new Date(iso);
	return format(d, "MMMM d, yyyy");
}

export function formatMonthDate(iso: string): string {
	const d = new Date(iso);
	return format(d, "MMMM d");
}

export function formatTime(iso: string): string {
	const d = new Date(iso);
	return format(d, "h:mma");
}

export function todayMonthDate() {
	return formatMonthDate(new Date().toISOString());
}

export function todayDay() {
	return format(new Date(), "EEEE");
}
