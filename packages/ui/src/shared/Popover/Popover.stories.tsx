import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button";
import { Popover } from "./Popover";

const meta: Meta<typeof Popover.Root> = {
	subcomponents: { ...Popover },
	tags: ["autodocs"],
	args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Popover.Root>
			<Popover.Trigger>
				<Button variant="solid-black">Open popover</Button>
			</Popover.Trigger>
			<Popover.Content>
				This is a popover with helpful content
			</Popover.Content>
		</Popover.Root>
	),
};