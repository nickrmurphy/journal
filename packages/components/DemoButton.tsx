import { css } from "goober";
import type { ComponentProps } from "react";

export const DemoButton = (props: ComponentProps<"button">) => (
	<button
		{...props}
		type="button"
		className={css({
			display: "flex",
			padding: "8px 16px",
			backgroundColor: "#0070f3",
			color: "white",
			border: "none",
			borderRadius: "4px",
			"&:hover": {
				backgroundColor: "orange",
			},
			"&:disabled": { backgroundColor: "#999", cursor: "not-allowed" },
		})}
	>
		Demo Button
	</button>
);
