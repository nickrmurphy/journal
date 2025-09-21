import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip.Root> = {
	subcomponents: { ...Tooltip },
	tags: ["autodocs"],
	args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tooltip.Root>
			<Tooltip.Trigger>
				<Button variant="solid-black">Hover me</Button>
			</Tooltip.Trigger>
			<Tooltip.Content>
				This is a tooltip with helpful information
			</Tooltip.Content>
		</Tooltip.Root>
	),
};
