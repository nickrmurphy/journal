import { cx } from "cva";
import { For, Show, type ComponentProps } from "solid-js";
import type { Entry } from "@/schemas";
import { EntryItem } from "./entry-item";

const Root = (props: ComponentProps<"div">) => (
	<div
		{...props}
		class={cx("rounded-xl bg-black p-1.5", props.class)}
	/>
);

const EmptyState = (props: ComponentProps<"div">) => (
	<div
		{...props}
		class={cx(
			"p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center",
			props.class,
		)}
	>
		No entries yet
	</div>
);

export const EntryList = (props: {
	entries: Entry[];
	onEntryClick?: (entry: Entry) => void;
}) => {
	return (
		<Root>
			<For each={props.entries}>
				{(entry) => (
					<EntryItem
						entry={entry}
						onClick={props.onEntryClick ? () => props.onEntryClick?.(entry) : undefined}
					/>
				)}
			</For>

			<Show when={props.entries.length === 0}>
				<EmptyState />
			</Show>
		</Root>
	);
};
