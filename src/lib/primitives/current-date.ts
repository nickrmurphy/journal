import { createDateNow as createDateNowBase } from "@solid-primitives/date";

export function createDateNow() {
	const [now] = createDateNowBase(1000 * 60);
	return now;
}
