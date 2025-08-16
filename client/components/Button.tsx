import {
	Button as HeadlessButton,
	type ButtonProps as HeadlessButtonProps,
} from "@headlessui/react";
import { cva, type VariantProps } from "cva";

const button = cva({
	base: "flex justify-center items-center gap-2 text-center active:scale-110 active:opacity-95 active:brightness-110 rounded-sm font-medium text-sm transition-all *:data-[slot=icon]:size-5 disabled:brightness-50",
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			outline: "bg-transparent border backdrop-blur-sm",
			ghost: "bg-transparent text-muted-foreground",
		},
		size: {
			md: "p-2.5",
			lg: "p-3.5",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

export type ButtonProps = HeadlessButtonProps & VariantProps<typeof button>;

export const Button = ({ variant, size, className, ...props }: ButtonProps) => (
	<HeadlessButton className={button({ variant, size, className })} {...props}>
		{props.children}
	</HeadlessButton>
);
