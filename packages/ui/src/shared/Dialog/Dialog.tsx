import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { cx } from "cva";
import type * as React from "react";

const Portal = BaseDialog.Portal;
const Backdrop = BaseDialog.Backdrop;
const Popup = BaseDialog.Popup;
const Root = BaseDialog.Root;
const Trigger = BaseDialog.Trigger;
const Close = BaseDialog.Close;
const Title = BaseDialog.Title;
const Description = BaseDialog.Description;

const dialogBackdrop = (className?: string) =>
	cx(
		"fixed inset-0 bg-black opacity-40 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
		className,
	);

const dialogPopup = (className?: string) =>
	cx(
		"fixed top-1/2 left-1/2 -mt-8 min-w-96 w-2/3 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-md bg-black p-6 border shadow-lg max-h-[80vh]",
		className,
	);

const Content = (props: { children: React.ReactNode }) => {
	return (
		<Portal>
			<Backdrop className={dialogBackdrop()} />
			<Popup
				className={dialogPopup(
					"transition-all duration-150 data-[ending-style]:-translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-4 data-[starting-style]:opacity-0 flex flex-col",
				)}
			>
				{props.children}
			</Popup>
		</Portal>
	);
};

const Body = (props: { children: React.ReactNode }) => {
	return <div className="flex-1 overflow-y-auto min-h-0">{props.children}</div>;
};

const Footer = (props: { children: React.ReactNode }) => {
	return (
		<div className="flex-shrink-0 pt-4 -mx-2 -mb-2 mt-2 border-t border-dashed">
			{props.children}
		</div>
	);
};

export const Dialog = {
	Root,
	Portal,
	Backdrop,
	Popup,
	Trigger,
	Close,
	Title,
	Description,
	Content,
	Body,
	Footer,
};

export { dialogBackdrop, dialogPopup };
