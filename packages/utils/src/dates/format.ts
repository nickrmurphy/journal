import { format } from "date-fns";

export const formatTime = (date: string) => format(new Date(date), "h:mm a");
export const formatMonthDate = (date: string) =>
	format(new Date(date), "MMMM d");
export const formatDay = (date: string) => format(new Date(date), "E");
