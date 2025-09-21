import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import { cx } from "cva";
import type * as React from "react";

const Root = ArkTooltip.Root;
const Trigger = ArkTooltip.Trigger;
const Positioner = ArkTooltip.Positioner;

const tooltipPopup = (className?: string) =>
	cx(
		"rounded shadow bg-darkgray/90 backdrop-blur p-1 text-xs border",
		"data-[state=open]:animate-[fadeIn_150ms_ease-out]",
		"data-[state=closed]:animate-[fadeOut_100ms_ease-in]",
		className,
	);

const Content = ({
	children,
	className,
	...props
}: {
	children: React.ReactNode;
	className?: string;
} & React.ComponentProps<typeof ArkTooltip.Content>) => {
	return (
		<Positioner>
			<ArkTooltip.Content {...props} className={tooltipPopup(className)}>
				{children}
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

export { tooltipPopup };
