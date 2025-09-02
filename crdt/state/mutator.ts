import type { CRDTState, Operation } from "./types";

const merge = (state: CRDTState, next: Operation): [CRDTState, boolean] => {
	// find matching entityId/path
	const current = state.find(
		(op) => op.entityId === next.entityId && op.path === next.path,
	);

	if (!current) {
		return [[...state, next], true];
	}

	if (current.eventstamp > next.eventstamp) {
		return [[...state], false];
	}

	const newState = state.filter(
		(op) => !(op.entityId === next.entityId && op.path === next.path),
	);

	return [[...newState, next], true];
};

export const set = (
	state: CRDTState,
	next: Operation[],
): [CRDTState, boolean] => {
	let newState = [...state];
	let modified = false;
	for (const op of next) {
		const res = merge(newState, op);
		newState = res[0];
		if (res[1]) {
			modified = true;
		}
	}
	return [newState, modified];
};
