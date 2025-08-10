import { cva, type VariantProps } from "cva";
import { motion } from "motion/react";
import type { ComponentProps } from "react";

const button = cva({
	base: "rounded-md font-medium text-sm transition-all p-2.5 *:data-[slot=icon]:size-5",
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			outline: "bg-transparent border-2 backdrop-blur-sm",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

export type ButtonProps = ComponentProps<typeof motion.button> &
	VariantProps<typeof button>;

export const Button = ({ variant, ...props }: ButtonProps) => (
	<motion.button
		className={button({ variant })}
		whileTap={{
			scale: 1.5,
			opacity: 0.9,
			backdropFilter: "blur(2px)",
			transition: { duration: 0.1, ease: "easeInOut" },
		}}
		{...props}
	>
		{props.children}
	</motion.button>
);
