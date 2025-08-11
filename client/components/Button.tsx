import { cva, type VariantProps } from "cva";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

const button = cva({
	base: "rounded-md font-medium text-sm disabled:brightness-50 transition-all p-2.5 *:data-[slot=icon]:size-5",
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			outline: "bg-transparent border backdrop-blur-sm",
			ghost: "bg-transparent text-muted-foreground",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

export type ButtonProps = ComponentProps<typeof motion.button> &
	VariantProps<typeof button>;

export const Button = ({ variant, className, ...props }: ButtonProps) => (
	<motion.button
		className={button({ variant, className })}
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
