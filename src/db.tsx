import { createDatabase, type QueryContext } from "@byearlybird/starling-db";
import {
	createContext,
	type DependencyList,
	use,
	useEffect,
	useRef,
	useState,
} from "react";
import { CommentSchema, EntrySchema } from "./lib/schemas";

const db = createDatabase({
	name: "journal",
	schema: {
		comments: { schema: CommentSchema, getId: (doc) => doc.id },
		entries: { schema: EntrySchema, getId: (doc) => doc.id },
	},
});

type Database = typeof db;
type DbSchemas = {
	comments: typeof CommentSchema;
	entries: typeof EntrySchema;
};

const DbContext = createContext<Database | null>(null);

export function DbProvider({ children }: { children: React.ReactNode }) {
	return <DbContext value={db}>{children}</DbContext>;
}

export function useQuery<R>(
	queryFn: (ctx: QueryContext<DbSchemas>) => R,
	deps: DependencyList,
): R {
	const database = useDb();

	const queryFnRef = useRef(queryFn);
	queryFnRef.current = queryFn;

	const [result, setResult] = useState<R>(() => {
		const handle = database.query((ctx) => queryFnRef.current(ctx));
		const initialResult = handle.result;
		handle.dispose();
		return initialResult;
	});

	useEffect(() => {
		const handle = database.query((ctx) => queryFnRef.current(ctx));
		setResult(handle.result);
		const unsubscribe = handle.subscribe(setResult);

		return () => {
			unsubscribe();
			handle.dispose();
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: deps is intentionally dynamic
	}, deps);

	return result;
}

export function useDb(): Database {
	const context = use(DbContext);
	if (!context) {
		throw new Error("useDb must be used within a DbProvider");
	}
	return context;
}
