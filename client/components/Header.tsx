import { cx } from "cva";
import type React from "react";
import { todayMonthDate } from "../utils/formatDate";

export type HeaderProps = React.ComponentPropsWithoutRef<"h1">;

export const Header = ({ className, children, ...rest }: HeaderProps) => (
	<h1 className={cx("text-2xl font-bold font-serif", className)} {...rest}>
		{children ?? todayMonthDate()}
	</h1>
);

Header.displayName = "Header";
