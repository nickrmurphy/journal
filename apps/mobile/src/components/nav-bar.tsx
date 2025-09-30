import { Link, type LinkProps } from "@tanstack/react-router";
import { cx } from "cva";
import type { ComponentProps, ReactNode } from "react";

export const NavBar = (props: ComponentProps<"nav">) => {
	return (
		<nav
			{...props}
			className={cx(
				"flex items-center bottom-[var(--safe-bottom)] fixed inset-x-4",
				"backdrop-blur flex items-center justify-between bg-lightgray/30 rounded-full p-0.5 transition-all w-fit",
				props.className,
			)}
		/>
	);
};

export const NavItem = (
	props: LinkProps & { label: string; children: ReactNode },
) => (
	<Link
		{...props}
		className="transition-all transition-discrete data-[status=active]:shadow data-[status=active]:outline-1 outline-lightgray/20 data-[status=active]:text-yellow data-[status=active]:bg-black/20 flex items-center gap-1.5 rounded-full [&>svg]:size-4 [&:not([data-status=active])>[data-part=label]]:hidden py-2.5 px-3.5 min-w-11 min-h-11 active:scale-110"
	>
		{props.children}
		<span data-part="label" className="transition-discrete">
			{props.label}
		</span>
	</Link>
);
