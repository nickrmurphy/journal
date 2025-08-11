import { cva, type VariantProps } from "cva";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

const button = cva({
	base: "rounded-md font-medium text-sm disabled:brightness-50 transition-all *:data-[slot=icon]:size-5",
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			outline: "bg-transparent border backdrop-blur-sm",
			ghost: "bg-transparent text-muted-foreground",
		},
		size: {
			md: "p-2.5",
			lg: "p-4.5",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "md",
	},
});

export type ButtonProps = ComponentProps<typeof motion.button> &
	VariantProps<typeof button>;

export const Button = ({ variant, size, className, ...props }: ButtonProps) => (
	<motion.button
		className={button({ variant, size, className })}
		whileTap={{
			scale: 1.5,
			opacity: 0.9,
			backdropFilter: "blur(4px)",
			filter: "brightness(1.1)",
			// border: "1px solid var(--border)",
			transition: { duration: 0.1, ease: "easeInOut" },
		}}
		{...props}
	>
		{props.children}
	</motion.button>
);
