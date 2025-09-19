import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EntryCreateDialog } from "./EntryCreateDialog";

const meta: Meta<typeof EntryCreateDialog> = {
	component: EntryCreateDialog,
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
	render: (args) => <EntryCreateDialog {...args} open={true} />,
};
