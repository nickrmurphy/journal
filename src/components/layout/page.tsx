import { cx } from "cva";
import { type ComponentProps, type JSX, type ValidComponent, Dynamic } from "solid-js";

type PageProps = {
	as?: ValidComponent;
} & ComponentProps<"div">;

export const Page = (props: PageProps) => {
	const Component = () => props.as || "div";
	return (
		<Dynamic
			component={Component()}
			{...props}
			class={cx(
				"pl-[calc(env(safe-area-inset-left)+0.5rem)] pr-[calc(env(safe-area-inset-right)+0.5rem)] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
				props.class,
			)}
		/>
	);
};
