import { useEffect, useState } from "react";

const getCurrentDate = () => {
	const date = new Date();
	date.setHours(0, 0, 0, 0); // Set to start of day
	return date.toISOString();
};

export function useCurrentDate() {
	const [currentDate, setCurrentDate] = useState(() => getCurrentDate());

	useEffect(() => {
		const interval = setInterval(() => {
			const newDate = getCurrentDate();
			if (currentDate !== newDate) {
				setCurrentDate(newDate);
			}
		}, 60000); // Check every minute

		return () => clearInterval(interval);
	}, [currentDate]);

	return currentDate;
}
