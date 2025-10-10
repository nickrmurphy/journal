import { Menu as ArkMenu } from "@ark-ui/react/menu";
import { cx } from "cva";
import type * as React from "react";

const Root = (props: React.ComponentProps<typeof ArkMenu.Root>) => (
	<ArkMenu.Root {...props} />
);

const Trigger = (props: React.ComponentProps<typeof ArkMenu.Trigger>) => (
	<ArkMenu.Trigger {...props} />
);

const Positioner = ArkMenu.Positioner;
const CheckboxItem = ArkMenu.CheckboxItem;
const RadioItemGroup = ArkMenu.RadioItemGroup;
const RadioItem = ArkMenu.RadioItem;
const Separator = ArkMenu.Separator;
const Arrow = ArkMenu.Arrow;

const Content = ({
	children,
	className,
	...props
}: {
	children: React.ReactNode;
	className?: string;
} & React.ComponentProps<typeof ArkMenu.Content>) => {
	return (
		<Positioner>
			<ArkMenu.Content
				{...props}
				className={cx(
					"focus:outline-none border p-0.5 origin-[var(--transform-origin)] rounded-2xl min-w-3xs bg-black shadow data-[state=open]:animate-[fadeIn_150ms_ease-out] data-[state=closed]:animate-[fadeOut_100ms_ease-in]",
					className,
				)}
			>
				{children}
			</ArkMenu.Content>
		</Positioner>
	);
};

const Item = (props: React.ComponentProps<typeof ArkMenu.Item>) => {
	return (
		<ArkMenu.Item
			className={cx(
				"transition-colors cursor-default select-none px-2 py-3 [&>svg]:size-4 text-sm text-lightgray hover:bg-darkgray/30 hover:text-lightgray data-[disabled]:pointer-events-none data-[disabled]:opacity-50 rounded-xl flex items-center gap-2",
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
	RadioItemGroup,
	RadioItem,
	Separator,
	Arrow,
};
