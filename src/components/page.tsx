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
				"pl-[calc(env(safe-area-inset-left)+0.5rem)] pr-[calc(env(safe-area-inset-right)+0.5rem)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
				props.className,
			)}
		/>
	);
};
