import type { Entry } from "@journal/core/schemas";
import { cx } from "cva";
import type { ComponentProps } from "react";
import { EntryDateCard } from "../entry-date-card";
import { EntryPreviewItem } from "../entry-preview-item";

const Root = (props: ComponentProps<"div">) => (
	<div {...props} className={cx("space-y-6 divide-y", props.className)} />
);

const EmptyState = (props: ComponentProps<"div">) => (
	<div
		{...props}
		className={cx(
			"p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center bg-black rounded",
			props.className,
		)}
	>
		Previous entries will appear here
	</div>
);

const Group = ({
	date,
	entries,
	onEntryClick,
}: {
	date: string;
	entries: Entry[];
	onEntryClick?: (entry: Entry, layoutId: string) => void;
}) => (
	<EntryDateCard key={date} date={date}>
		{entries.map((entry) => (
			<EntryPreviewItem
				key={entry.id}
				entry={entry}
				onClick={onEntryClick ? () => onEntryClick(entry, entry.id) : undefined}
			/>
		))}
	</EntryDateCard>
);

type EntryPreviewListProps = {
	data: Array<{ date: string; entries: Entry[] }>;
	onEntryClick?: (entry: Entry, layoutId: string) => void;
};

export const EntryPreviewList = (props: EntryPreviewListProps) => (
	<Root>
		{props.data.map(({ date, entries }) => (
			<Group
				key={date}
				date={date}
				entries={entries}
				onEntryClick={props.onEntryClick}
			/>
		))}
		{props.data.length === 0 && <EmptyState />}
	</Root>
);
