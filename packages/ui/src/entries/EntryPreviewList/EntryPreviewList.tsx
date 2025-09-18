import type { JournalEntry } from "@journal/core/types";
import { cx } from "cva";
import type { ComponentProps } from "react";
import { EntryDateCard } from "../EntryDateCard";
import { EntryPreviewItem } from "../EntryPreviewItem";

const Root = (props: ComponentProps<"div">) => (
	<div {...props} className={cx("space-y-6 divide-y", props.className)} />
);

const EmptyState = (props: ComponentProps<"div">) => (
	<div
		{...props}
		className={cx(
			"p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center bg-black rounded shadow",
			props.className,
		)}
	>
		Previous entries will appear here
	</div>
);

const Group = ({
	date,
	entries,
}: {
	date: string;
	entries: JournalEntry[];
}) => (
	<EntryDateCard key={date} date={date}>
		{entries.map((entry) => (
			<EntryPreviewItem key={entry.createdAt} entry={entry} />
		))}
	</EntryDateCard>
);

type EntryPreviewListProps = {
	data: Array<{ date: string; entries: JournalEntry[] }>;
};

export const EntryPreviewList = (props: EntryPreviewListProps) => (
	<Root>
		{props.data.map(({ date, entries }) => (
			<Group key={date} date={date} entries={entries} />
		))}
		{props.data.length === 0 && <EmptyState />}
	</Root>
);
