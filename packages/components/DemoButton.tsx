import { css } from "goober";

export const DemoButton = () => {
	return (
		<button
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
			})}
		>
			Demo Button
		</button>
	);
};
