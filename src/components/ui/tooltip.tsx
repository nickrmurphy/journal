import { Tooltip as ArkTooltip } from "@ark-ui/solid/tooltip";
import { cx } from "cva";
import type { ComponentProps, JSX } from "solid-js";

const Root = ArkTooltip.Root;
const Trigger = ArkTooltip.Trigger;
const Positioner = ArkTooltip.Positioner;

const tooltipPopup = (className?: string) =>
	cx(
		"rounded-xl shadow bg-darkgray/90 backdrop-blur p-1 text-xs border",
		"data-[state=open]:animate-[fadeIn_150ms_ease-out]",
		"data-[state=closed]:animate-[fadeOut_100ms_ease-in]",
		className,
	);

const Content = (
	props: {
		children: JSX.Element;
		class?: string;
	} & ComponentProps<typeof ArkTooltip.Content>,
) => {
	return (
		<Positioner>
			<ArkTooltip.Content {...props} class={tooltipPopup(props.class)}>
				{props.children}
			</ArkTooltip.Content>
		</Positioner>
	);
};

export const Tooltip = {
	Root,
	Trigger,
	Positioner,
	Content,
};
