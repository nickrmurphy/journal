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
	entryRepo,
} from "../collections/entries";

const RepoContext = createContext<{
	data: Entry[];
	repo: typeof entryRepo;
} | null>(null);

export function RepoProvider({ children }: { children: ReactNode }) {
	const [data, setData] = useState<Entry[]>([]);

	useEffect(() => {
		const refreshData = async () => {
			await entryRepo.materialize().then(setData);
		};

		refreshData();
		const unsub = entryRepo.subscribe(refreshData);

		return () => {
			unsub();
		};
	}, []);

	const contextValue = useMemo(() => ({ data, repo: entryRepo }), [data]);

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

export function useQuery<T>(selector: (data: Entry[]) => T) {
	const { data } = useRepo();
	return useMemo(() => selector(data), [data, selector]);
}

export function useMutate() {
	const { repo } = useRepo();

	const insert = useCallback(
		(data: CreateEntryInput) => {
			const parsedData = entry(data);
			repo.mutate(parsedData);
		},
		[repo],
	);

	const update = useCallback(
		async (
			id: string,
			mutator: (current: Entry) => Partial<Omit<Entry, "$id">>,
		) => {
			const currentData = await repo.materialize();
			const current = currentData.find((entry) => entry.$id === id);
			if (!current) return;

			const modified = mutator(current);
			await repo.mutate({
				$id: id,
				...modified,
			});
		},
		[repo],
	);

	return useMemo(() => ({ insert, update }), [insert, update]);
}
