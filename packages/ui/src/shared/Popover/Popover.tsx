import { Popover as BasePopover } from "@base-ui-components/react/popover";
import { cx } from "cva";
import type * as React from "react";

const Root = BasePopover.Root;
const Trigger = BasePopover.Trigger;
const Portal = BasePopover.Portal;
const Positioner = BasePopover.Positioner;
const Popup = BasePopover.Popup;

const popoverPopup = (className?: string) =>
	cx(
		"origin-[var(--transform-origin)] rounded-md shadow transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 bg-black border p-2",
		className,
	);

const Content = ({
	children,
	align = "end",
	side = "bottom",
	sideOffset = 8,
	className,
	...props
}: {
	children: React.ReactNode;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom" | "left" | "right";
	sideOffset?: number;
	className?: string;
} & React.ComponentProps<typeof BasePopover.Popup>) => {
	return (
		<Portal>
			<Positioner align={align} side={side} sideOffset={sideOffset}>
				<Popup {...props} className={popoverPopup(className)}>
					{children}
				</Popup>
			</Positioner>
		</Portal>
	);
};

export const Popover = {
	Root,
	Trigger,
	Portal,
	Positioner,
	Popup,
	Content,
};

export { popoverPopup };
