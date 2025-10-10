import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./menu";

const meta: Meta<typeof Menu.Root> = {
	title: "Shared/Menu",
	component: Menu.Root,
	parameters: {
		layout: "centered",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Menu.Root>
			<Menu.Trigger className="rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
				Open Menu
			</Menu.Trigger>
			<Menu.Content>
				<Menu.Item>Item 1</Menu.Item>
				<Menu.Item>Item 2</Menu.Item>
				<Menu.Item>Item 3</Menu.Item>
			</Menu.Content>
		</Menu.Root>
	),
};
