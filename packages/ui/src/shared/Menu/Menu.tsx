import { Menu as BaseMenu } from "@base-ui-components/react/menu";
import { cx } from "cva";
import type * as React from "react";

const Root = (props: React.ComponentProps<typeof BaseMenu.Root>) => (
	<BaseMenu.Root {...props} />
);

const Trigger = (props: React.ComponentProps<typeof BaseMenu.Trigger>) => (
	<BaseMenu.Trigger {...props} />
);

const Portal = BaseMenu.Portal;
const Positioner = BaseMenu.Positioner;
const Popup = BaseMenu.Popup;
const CheckboxItem = BaseMenu.CheckboxItem;
const RadioGroup = BaseMenu.RadioGroup;
const RadioItem = BaseMenu.RadioItem;
const Separator = BaseMenu.Separator;
const Arrow = BaseMenu.Arrow;

const Content = (props: React.ComponentProps<typeof BaseMenu.Positioner>) => {
	return (
		<Portal>
			<Positioner {...props}>
				<Popup
					className={cx(
						"border p-0.5 origin-[var(--transform-origin)] rounded-md min-w-3xs bg-black shadow-md transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
						props.className,
					)}
				>
					{props.children}
				</Popup>
			</Positioner>
		</Portal>
	);
};

const Item = (props: React.ComponentProps<typeof BaseMenu.Item>) => {
	return (
		<BaseMenu.Item
			className={cx(
				"transition-colors cursor-default select-none px-2 py-3 [&>svg]:size-4 text-sm text-lightgray hover:bg-darkgray/30 hover:text-lightgray data-[disabled]:pointer-events-none data-[disabled]:opacity-50 rounded flex items-center gap-2",
				props.className,
			)}
			{...props}
		/>
	);
};

export const Menu = {
	Root,
	Trigger,
	Content,
	Item,
	CheckboxItem,
	RadioGroup,
	RadioItem,
	Separator,
	Arrow,
};
