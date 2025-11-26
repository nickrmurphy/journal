import { cx } from "cva";
import { format } from "date-fns";
import { type ComponentProps, type JSX } from "solid-js";

const Root = (props: ComponentProps<"div">) => (
	<div
		{...props}
		class={cx("w-full rounded-xl bg-black p-1", props.class)}
	/>
);

const Header = (props: ComponentProps<"h2">) => (
	<h2
		{...props}
		class={cx(
			"flex items-baseline gap-1.5 px-1.5 pt-2 pb-1",
			props.class,
		)}
	/>
);

const DateDay = (props: ComponentProps<"span">) => (
	<span {...props} class={cx("text-sm", props.class)} />
);

const DateMonth = (props: ComponentProps<"span">) => (
	<span
		{...props}
		class={cx("text-lightgray/70 text-xs", props.class)}
	/>
);

const Content = (props: ComponentProps<"div">) => (
	<div {...props} class={cx("", props.class)} />
);

type EntryDateCardProps = {
	date: string;
	children: JSX.Element;
};

export function EntryDateCard(props: EntryDateCardProps) {
	const d = () => new Date(props.date);

	return (
		<Root>
			<Header>
				<DateDay>{format(d(), "EEE d")}</DateDay>
				<DateMonth>{format(d(), "MMM")}</DateMonth>
			</Header>
			<Content>{props.children}</Content>
		</Root>
	);
}
