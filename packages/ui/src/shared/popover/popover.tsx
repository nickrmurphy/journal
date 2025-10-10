import { Popover as ArkPopover } from "@ark-ui/react/popover";
import { Portal } from "@ark-ui/react/portal";
import { cx } from "cva";
import type * as React from "react";

const Root = (props: React.ComponentProps<typeof ArkPopover.Root>) => (
	<ArkPopover.Root {...props} />
);

const Trigger = (props: React.ComponentProps<typeof ArkPopover.Trigger>) => (
	<ArkPopover.Trigger {...props} />
);

const Positioner = ArkPopover.Positioner;

const popoverPopup = (className?: string) =>
	cx(
		"origin-[var(--transform-origin)] rounded-2xl shadow bg-black border p-2 data-[state=open]:animate-[fadeIn_150ms_ease-out] data-[state=closed]:animate-[fadeOut_100ms_ease-in]",
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
} & React.ComponentProps<typeof ArkPopover.Content>) => {
	return (
		<Portal>
			<Positioner>
				<ArkPopover.Content {...props} className={popoverPopup(className)}>
					{children}
				</ArkPopover.Content>
			</Positioner>
		</Portal>
	);
};

export const Popover = {
	Root,
	Trigger,
	Portal,
	Positioner,
	Content,
};

export { popoverPopup };
