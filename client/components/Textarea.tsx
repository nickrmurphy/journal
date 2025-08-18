import {
	Textarea as HeadlessTextarea,
	type TextareaProps as HeadlessTextareaProps,
} from "@headlessui/react";
import { cx } from "cva";

export const Textarea = ({ className, ...props }: HeadlessTextareaProps) => (
	<HeadlessTextarea
		className={cx(
			"min-h-10 w-full flex-1 resize-none overflow-y-auto rounded-md border p-3 outline-none data-focus:ring data-focus:ring-accent",
			className,
		)}
		{...props}
	/>
);
