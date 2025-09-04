import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	type CreateEntryInput,
	type Entry,
	entry,
	entryStore,
} from "../collections/entries";

const RepoContext = createContext<{
	data: Record<string, Entry>;
	repo: typeof entryStore;
} | null>(null);

export function RepoProvider({ children }: { children: ReactNode }) {
	const [data, setData] = useState<Record<string, Entry>>({});

	useEffect(() => {
		const refreshData = () => {
			entryStore.load().then(() => {
				const data = entryStore.get();
				setData(data || {});
			});
		};

		refreshData();
		const unsub = entryStore.on("mutate", refreshData);

		return () => {
			unsub();
		};
	}, []);

	const contextValue = useMemo(() => ({ data, repo: entryStore }), [data]);

	return (
		<RepoContext.Provider value={contextValue}>{children}</RepoContext.Provider>
	);
}

export function useRepo() {
	const repo = useContext(RepoContext);
	if (!repo) {
		throw new Error("useRepo must be used within a RepoProvider");
	}
	return repo;
}

export function useQuery<T>(selector: (data: Record<string, Entry>) => T) {
	const { data } = useRepo();
	return useMemo(() => selector(data), [data, selector]);
}

export function useMutate() {
	const { repo } = useRepo();

	const insert = useCallback(
		(data: CreateEntryInput) => {
			const parsedData = entry(data);
			repo.set({ [parsedData.$id]: parsedData });
		},
		[repo],
	);

	const update = useCallback(
		async (
			id: string,
			mutator: (current: Entry) => Partial<Omit<Entry, "$id">>,
		) => {
			const currentData = (await repo.get()) || {};
			const current = currentData[id];
			if (!current) return;

			const modified = mutator(current);
			await repo.set({ [id]: { ...current, ...modified } });
		},
		[repo],
	);

	return useMemo(() => ({ insert, update }), [insert, update]);
}
