import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { CreateEntryDialog } from "./CreateEntryDialog";

const meta: Meta<typeof CreateEntryDialog> = {
	title: "Components/CreateEntryDialog",
	component: CreateEntryDialog,
	tags: ["autodocs"],
	args: {
		onOpenChangeComplete: fn(),
		onSubmit: fn(),
		onClose: fn(),
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => <CreateEntryDialog {...args} open={true} />,
};
