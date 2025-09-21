import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import { cx } from "cva";
import type * as React from "react";

const Root = BaseTooltip.Root;
const Trigger = BaseTooltip.Trigger;
const Portal = BaseTooltip.Portal;
const Positioner = BaseTooltip.Positioner;
const Popup = BaseTooltip.Popup;

const tooltipPopup = (className?: string) =>
	cx(
		"bg-darkgray/90 backdrop-blur rounded shadow-lg p-1 text-xs border",
		className,
	);

const Content = ({
	children,
	align = "start",
	side = "bottom",
	sideOffset = 4,
	className,
	...props
}: {
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	className?: string;
} & React.ComponentProps<typeof BaseTooltip.Popup>) => {
	return (
		<Portal>
			<Positioner align={align} side={side} sideOffset={sideOffset}>
				<Popup {...props} className={tooltipPopup(className)}>
					{children}
				</Popup>
			</Positioner>
		</Portal>
	);
};

export const Tooltip = {
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Content,
};

export { tooltipPopup };
