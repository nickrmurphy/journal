import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type * as React from "react";

const Root = BaseDialog.Root;
const Trigger = BaseDialog.Trigger;
const Close = BaseDialog.Close;
const Title = BaseDialog.Title;
const Description = BaseDialog.Description;

const Content = (props: { children: React.ReactNode }) => {
	return (
		<BaseDialog.Portal>
			<BaseDialog.Backdrop className="fixed inset-0 bg-black opacity-40 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
			<BaseDialog.Popup className="fixed top-1/2 left-1/2 -mt-8 min-w-96 w-2/3 max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-md bg-black p-6 transition-all duration-150 data-[ending-style]:-translate-y-4 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-4 data-[starting-style]:opacity-0 border shadow-lg">
				{props.children}
			</BaseDialog.Popup>
		</BaseDialog.Portal>
	);
};

export const Dialog = {
	Root,
	Trigger,
	Close,
	Title,
	Description,
	Content,
};
