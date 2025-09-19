import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";

const button = cva({
	base: "rounded-full shrink-0 text-sm active:scale-105 disabled:active:scale-100 transition-all disabled:opacity-50",
	variants: {
		variant: {
			"solid-black": "bg-black text-lightgray hover:bg-black/90 ",
			"solid-lightgray": "bg-lightgray text-black hover:bg-lightgray/90",
			"outline-black": "border border-black text-black hover:bg-black/5",
			"outline-lightgray":
				"border border-lightgray text-lightgray hover:bg-lightgray/10",
			"solid-yellow": "bg-yellow text-black hover:bg-yellow/90",
			"outline-yellow": "border border-yellow text-yellow hover:bg-yellow/10",
		},
		size: {
			md: "px-3.5 py-2 [&>svg]:size-4",
			"md-icon": "size-9 flex items-center justify-center [&>svg]:size-4",
		},
	},
	defaultVariants: {
		variant: "solid-black",
		size: "md",
	},
});

export type ButtonProps = ComponentProps<"button"> &
	VariantProps<typeof button>;

export const Button = ({ ...props }: ButtonProps) => (
	<button type="button" {...props} className={button(props)} />
);

export { button };
