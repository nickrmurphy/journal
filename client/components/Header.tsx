import { cx } from "cva";
import type React from "react";

export type HeaderProps = React.ComponentPropsWithoutRef<"h1">;

export const Header = ({ className, children, ...rest }: HeaderProps) => (
	<h1 className={cx("text-2xl font-bold font-sans", className)} {...rest}>
		{children}
	</h1>
);

Header.displayName = "Header";
