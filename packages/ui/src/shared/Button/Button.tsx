import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";

const button = cva({
	base: "rounded-full text-sm active:scale-105 transition-all",
	variants: {
		variant: {
			"solid-black": "bg-black text-lightgray hover:bg-black/90 ",
			"outline-black": "border border-black text-black hover:bg-black/5",
			"solid-yellow": "bg-yellow text-black hover:bg-yellow/90",
			"outline-yellow": "border border-yellow text-yellow hover:bg-yellow/10",
		},
		size: {
			md: "px-3.5 py-2 [&>svg]:size-4",
			"md-icon": "p-2.5  [&>svg]:size-4",
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
