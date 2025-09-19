import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";

const textarea = cva({
	base: "resize-none outline-none placeholder:text-lightgray/70",
});

export type TextareaProps = ComponentProps<"textarea"> &
	VariantProps<typeof textarea>;

export const Textarea = ({ ...props }: TextareaProps) => (
	<textarea {...props} className={textarea({ className: props.className })} />
);

export { textarea };