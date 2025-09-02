import type { CRDTState, Operation } from "./types";

const merge = (state: CRDTState, next: Operation): [CRDTState, boolean] => {
	// find matching entityId/path
	const current = state.find((op) => op[1] === next[1] && op[2] === next[2]);

	if (!current) {
		return [[...state, next], true];
	}

	if (current[0] > next[0]) {
		return [[...state], false];
	}

	const newState = state.filter(
		(op) => !(op[1] === next[1] && op[2] === next[2]),
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
