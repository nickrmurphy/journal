export type Entry = {
	$id: string;
	content: string;
	createdAt: string;
};

export type Action<
	TType extends string,
	TData = never,
	TReturn = unknown,
> = (params: { type: TType; data: TData }) => TReturn;

export type Actions = {
	ListEntries: Action<"list-entries", never, Promise<Entry[]>>;
	CreateEntry: Action<"create-entry", { content: string }, Promise<Entry>>;
};
