import {
	Textarea as HeadlessTextarea,
	type TextareaProps as HeadlessTextareaProps,
} from "@headlessui/react";
import { cx } from "cva";

export const Textarea = ({ className, ...props }: HeadlessTextareaProps) => (
	<HeadlessTextarea
		className={cx(
			"flex-1 min-h-10 w-full resize-none border rounded-md p-3 outline-none data-focus:ring data-focus:ring-accent overflow-y-auto",
			className,
		)}
		{...props}
	/>
);
