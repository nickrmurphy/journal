import type { Entry } from "@journal/core/schemas";
import { cx } from "cva";
import type { ComponentProps } from "react";
import { EntryItem } from "..";

const Root = (props: ComponentProps<"div">) => (
	<div {...props} className={cx("rounded-xl bg-black p-1.5", props.className)} />
);

const EmptyState = (props: ComponentProps<"div">) => (
	<div
		{...props}
		className={cx(
			"p-4 text-center text-sm text-lightgray/70 m-auto my-auto self-center",
			props.className,
		)}
	>
		No entries yet
	</div>
);

export const EntryList = ({
	entries,
	onEntryClick,
}: {
	entries: Entry[];
	onEntryClick?: (entry: Entry) => void;
}) => {
	return (
		<Root>
			{entries.map((entry) => (
				<EntryItem
					key={entry.id}
					entry={entry}
					onClick={onEntryClick ? () => onEntryClick(entry) : undefined}
				/>
			))}

			{entries.length === 0 && <EmptyState />}
		</Root>
	);
};
