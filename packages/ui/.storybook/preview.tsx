import type { Preview } from "@storybook/react-vite";
import "../src/main.css";
import { Tooltip } from "@base-ui-components/react/tooltip";

const preview: Preview = {
	tags: ["autodocs"],
	parameters: {
		backgrounds: {
			options: {
				// 👇 Add your own
				bg: { name: "Background", value: "var(--color-darkgray)" },
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "error",
		},
	},
	decorators: [
		(Story) => (
			<Tooltip.Provider>
				<Story />
			</Tooltip.Provider>
		),
	],
	initialGlobals: {
		// 👇 Set the initial background color
		backgrounds: { value: "bg" },
	},
};

export default preview;
