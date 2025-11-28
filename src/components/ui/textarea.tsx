import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "solid-js";

const textarea = cva({
	base: "resize-none outline-none placeholder:text-lightgray/70",
});

type TextareaProps = ComponentProps<"textarea"> & VariantProps<typeof textarea>;

export const Textarea = (props: TextareaProps) => (
	<textarea {...props} class={textarea({ class: props.class })} />
);
