import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { Tooltip } from "./tooltip";

const meta: Meta<typeof Tooltip.Root> = {
	subcomponents: { ...Tooltip },
	tags: ["autodocs"],
	args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip.Root positioning={{ placement: "bottom", gutter: 4 }}>
			<Tooltip.Trigger>
				<Button variant="solid-black">Hover me</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				This is a tooltip with helpful information
			</Tooltip.Content>
		</Tooltip.Root>
	),
};
