import type { Field, State } from "./types";

const findField = (state: State, next: Field) =>
	state.find((f) => f.entityId === next.entityId && f.path === next.path);

const replaceField = (state: State, next: Field) => {
	const removed = state.filter(
		(existing) =>
			existing.entityId !== next.entityId || existing.path !== next.path,
	);
	return [...removed, next];
};

export const mergeField = (state: State, next: Field): [State, boolean] => {
	// find matching entityId/path
	const current = findField(state, next);
	if (!current) {
		return [[...state, next], true];
	} else if (current.eventstamp > next.eventstamp) {
		return [state, false];
	} else {
		return [replaceField(state, next), true];
	}
};

export const mergeState = (state: State, next: State): [State, boolean] => {
	const [newState, modified] = next.reduce(
		([acc, mod], field) => {
			const [mergedState, changed] = mergeField(acc, field);
			return [mergedState, mod || changed];
		},
		[state, false],
	);
	return [newState, modified];
};
