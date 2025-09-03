/**
 * A Field, in this context, is a represenation of specific object path at a point in time.
 * State, in this context, is an array of Fields that describe a single object.
 */

export type Field = {
	eventstamp: string;
	path: string;
	value: JSONValue;
};
export type State = Field[];
