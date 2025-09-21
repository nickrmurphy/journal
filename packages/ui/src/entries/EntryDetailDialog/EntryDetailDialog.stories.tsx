import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EntryDetailDialog } from "./EntryDetailDialog";

const meta = {
	component: EntryDetailDialog,
	tags: ["autodocs"],
	args: {
		onClose: fn(),
		onComment: fn(),
		isOpen: true,
	},
} satisfies Meta<typeof EntryDetailDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		entry: {
			id: "1",
			content: "This is a sample journal entry displayed in the detail dialog.",
			createdAt: "2023-01-01T12:00:00Z",
		},
	},
};

export const LongContent: Story = {
	args: {
		entry: {
			id: "2",
			content:
				"This is a much longer journal entry that demonstrates how the EntryDetailDialog handles substantial content. It includes multiple sentences and thoughts that span several lines to test the layout and readability of the dialog component. This helps ensure that longer entries are properly displayed with appropriate spacing and typography within the modal interface.",
			createdAt: "2023-01-01T14:30:00Z",
		},
	},
};

export const WithComments: Story = {
	args: {
		entry: {
			id: "3",
			content:
				"This entry demonstrates how the dialog displays entries that have associated comments.",
			createdAt: "2023-01-01T12:45:00Z",
		},
	},
};
