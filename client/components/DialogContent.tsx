import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import type React from "react";

export const DialogContent = ({
	children,
	...props
}: React.ComponentProps<typeof BaseDialog.Popup>) => (
	<BaseDialog.Portal>
		<BaseDialog.Backdrop className="fixed inset-0 bg-black opacity-30 transition-opacity duration-200 sm:flex sm:justify-center data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 dark:opacity-70" />
		<BaseDialog.Popup
			{...props}
			className="fixed flex flex-col gap-3 top-0 inset-x-0 translate-y-0 bg-background/90 backdrop-blur-xs text-foreground p-3 h-1/3 border-b rounded-b-xl transition-transform duration-300 ease-out data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full"
		>
			{children}
		</BaseDialog.Popup>
	</BaseDialog.Portal>
);
