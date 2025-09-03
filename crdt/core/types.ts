/**
 * An Entity, in this context, is some uniquely identifiable and JSON serializable object.
 * A Field, in this context, is a represenation of specific object path at a point in time.
 * State, in this context, is an array of Fields that describe an entity, or entities.
 */

export type Entity = { $id: string } & { [key: string]: JSONValue };
export type Field = {
	entityId: string;
	eventstamp: string;
	path: string;
	value: JSONValue;
};
export type State = Field[];
