import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { cx } from "cva";
import type * as React from "react";

const Backdrop = ArkDialog.Backdrop;
const Positioner = ArkDialog.Positioner;
const Root = ArkDialog.Root;
const Trigger = ArkDialog.Trigger;
const Close = ArkDialog.CloseTrigger;
const Title = ArkDialog.Title;
const Description = ArkDialog.Description;

const dialogBackdrop = (className?: string) =>
	cx(
		"fixed inset-0 bg-black/40",
		"opacity-0 data-[state=open]:opacity-100",
		"transition-opacity duration-150 ease-out data-[state=closed]:ease-in",
		className,
	);

const dialogContent = (className?: string) =>
	cx(
		"flex flex-col fixed top-1/8 left-1/2 -translate-x-1/2 -translate-y-1/8 w-full max-w-xl md:top-1/2 md:-translate-y-1/2 md:-mt-8 md:min-w-96 md:w-2/3 rounded-md bg-black p-6 border shadow max-h-[80vh]",
		"data-[state=open]:animate-[slideUp_150ms_ease-out]",
		"data-[state=closed]:animate-[slideOut_100ms_ease-in]",
		className,
	);

const Content = (props: { children: React.ReactNode }) => (
	<Portal>
		<Backdrop className={dialogBackdrop()} />
		<Positioner>
			<ArkDialog.Content className={dialogContent()}>
				{props.children}
			</ArkDialog.Content>
		</Positioner>
	</Portal>
);

const Body = (props: { children: React.ReactNode }) => (
	<div className="flex-1 overflow-y-auto min-h-0">{props.children}</div>
);

const Footer = (props: { children: React.ReactNode }) => (
	<div className="flex-shrink-0 pt-4 -mx-2 -mb-2 mt-2 border-t border-dashed">
		{props.children}
	</div>
);

export const Dialog = {
	Root,
	Portal,
	Backdrop,
	Positioner,
	Trigger,
	Close,
	Title,
	Description,
	Content,
	Body,
	Footer,
};
