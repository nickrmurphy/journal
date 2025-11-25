import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { Button } from "../shared/button";
import { Menu } from "../shared/menu";
import { DataMenu } from "./data-menu";

const meta: Meta<typeof DataMenu> = {
	title: "Settings/DataMenu",
	component: DataMenu,
	parameters: {
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<Menu.Root>
				<Menu.Trigger>
					<Button variant="outline-lightgray" size="md-icon">
						⋮
					</Button>
				</Menu.Trigger>
				<Story />
			</Menu.Root>
		),
	],
	args: {
		onExport: fn(),
		onImport: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
