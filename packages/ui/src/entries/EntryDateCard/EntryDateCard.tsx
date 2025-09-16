import { cx } from "cva";
import { format } from "date-fns";
import type { ComponentProps, PropsWithChildren } from "react";

const Root = (props: ComponentProps<"div">) => (
	<div
		{...props}
		className={cx("w-full rounded bg-black p-1 shadow", props.className)}
	/>
);

const Header = (props: ComponentProps<"h2">) => (
	<h2
		{...props}
		className={cx(
			"flex items-baseline gap-1.5 px-1.5 pt-2 pb-1",
			props.className,
		)}
	/>
);

const DateDay = (props: ComponentProps<"span">) => (
	<span {...props} className={cx("text-sm", props.className)} />
);

const DateMonth = (props: ComponentProps<"span">) => (
	<span
		{...props}
		className={cx("text-lightgray/70 text-xs", props.className)}
	/>
);

const Content = (props: ComponentProps<"div">) => (
	<div {...props} className={cx("", props.className)} />
);

type EntryDateCardProps = PropsWithChildren<{
	date: string;
}>;

export function EntryDateCard({ date, children }: EntryDateCardProps) {
	const d = new Date(date);

	return (
		<Root>
			<Header>
				<DateDay>{format(d, "EEE d")}</DateDay>
				<DateMonth>{format(d, "MMM")}</DateMonth>
			</Header>
			<Content>{children}</Content>
		</Root>
	);
}
