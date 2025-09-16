import { cx } from "cva";
import type { ComponentProps } from "react";

const Root = (props: ComponentProps<"div">) => (
	<div
		{...props}
		className={cx("fixed inset-0 grid grid-cols-6", props.className)}
	/>
);

const Aside = (props: ComponentProps<"aside">) => (
	<aside
		{...props}
		className={cx("col-span-2 overflow-y-auto p-3", props.className)}
	/>
);

const Main = (props: ComponentProps<"main">) => (
	<main
		{...props}
		className={cx("col-span-4 overflow-y-auto p-3", props.className)}
	>
		<div className="mx-auto flex w-full max-w-3xl flex-col">
			{props.children}
		</div>
	</main>
);

export const AsideLayout = {
	Root,
	Aside,
	Main,
};
