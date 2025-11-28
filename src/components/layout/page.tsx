import { cx } from "cva";
import type { ComponentProps, ValidComponent } from "solid-js";

type PageProps<T extends ValidComponent = "div"> = ComponentProps<T>;

export const Page = <T extends ValidComponent = "div">(props: PageProps<T>) => {
	return (
		<div
			{...props}
			class={cx(
				"pl-[calc(var(--safe-left)+0.5rem)] pr-[calc(var(--safe-right)+0.5rem)] pt-[var(--safe-top)] pb-[var(--safe-bottom)]",
				props.class,
			)}
		/>
	);
};
