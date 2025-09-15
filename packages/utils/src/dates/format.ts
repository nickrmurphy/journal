import { format } from "date-fns";

export const formatTime = (date: string) => format(new Date(date), "h:mm a");
