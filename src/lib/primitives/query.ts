import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";
import { db } from "../db/db";

type QueryFn<T> = Parameters<typeof db.query<T>>[0];

// Prevents a type from being used in type inference
type NoInfer<T> = [T][T extends unknown ? 0 : never];

/**
 * Creates a reactive query that automatically re-runs when dependencies change.
 * Manages query lifecycle (subscription and disposal) automatically.
 *
 * @param queryFn - Query function that receives a transaction and returns a result
 * @param initialValue - Optional initial value (when provided, removes undefined from return type)
 * @returns Accessor containing the query result
 *
 * @example
 * ```ts
 * // With initial value (type is Accessor<Entry[]> - no undefined!)
 * const entries = createQuery((tx) => tx.entries.getAll(), []);
 * entries().forEach(entry => console.log(entry));
 *
 * // Without initial value (type is Accessor<Entry[] | undefined>)
 * const entries = createQuery((tx) => tx.entries.getAll());
 * if (entries()) {
 *   entries().forEach(entry => console.log(entry));
 * }
 * ```
 */
export function createQuery<T>(
	queryFn: QueryFn<T>,
	initialValue: NoInfer<T>,
): Accessor<T>;
export function createQuery<T>(queryFn: QueryFn<T>): Accessor<T | undefined>;
export function createQuery<T>(
	queryFn: QueryFn<T>,
	initialValue?: NoInfer<T>,
): Accessor<T | undefined> {
	const [data, setData] = createSignal<T | undefined>(initialValue);

	createEffect(() => {
		const query = db.query(queryFn);

		setData(() => query.result);

		const unsubscribe = query.subscribe((results) => {
			setData(() => results);
		});

		onCleanup(() => {
			unsubscribe();
			query.dispose();
		});
	});

	return data;
}
