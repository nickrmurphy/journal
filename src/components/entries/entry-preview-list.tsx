import { cx } from "cva";
import { For, Show, type ComponentProps } from "solid-js";
import type { Entry } from "@/schemas";
import { EntryDateCard } from "./entry-date-card";
import { EntryPreviewItem } from "./entry-preview-item";

const Root = (props: ComponentProps<"div">) => (
	<div {...props} class={cx("space-y-6 divide-y", props.class)} />
);

const EmptyState = (props: ComponentProps<"div">) => (
	<div
		{...props}
		class={cx(
			"p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center bg-black rounded-xl",
			props.class,
		)}
	>
		Past entries will appear here
	</div>
);

const Group = (props: {
	date: string;
	entries: Entry[];
	onEntryClick?: (entry: Entry) => void;
}) => (
	<EntryDateCard date={props.date}>
		<For each={props.entries}>
			{(entry) => (
				<EntryPreviewItem
					entry={entry}
					onClick={props.onEntryClick ? () => props.onEntryClick?.(entry) : undefined}
				/>
			)}
		</For>
	</EntryDateCard>
);

type EntryPreviewListProps = {
	data: Array<{ date: string; entries: Entry[] }>;
	onEntryClick?: (entry: Entry) => void;
};

export const EntryPreviewList = (props: EntryPreviewListProps) => (
	<Root>
		<For each={props.data}>
			{({ date, entries }) => (
				<Group
					date={date}
					entries={entries}
					onEntryClick={props.onEntryClick}
				/>
			)}
		</For>
		<Show when={props.data.length === 0}>
			<EmptyState />
		</Show>
	</Root>
);
