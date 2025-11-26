import { cx } from "cva";
import type { ComponentProps, ElementType } from "react";

type PageProps<T extends ElementType = "div"> = {
	as?: T;
} & ComponentProps<T>;

export const Page = <T extends ElementType = "div">({
	as,
	...props
}: PageProps<T>) => {
	const Component = as || "div";
	return (
		<Component
			{...props}
			className={cx(
				"pl-[calc(var(--safe-left)+0.5rem)] pr-[calc(var(--safe-right)+0.5rem)] pt-[var(--safe-top)] pb-[var(--safe-bottom)]",
				props.className,
			)}
		/>
	);
};
