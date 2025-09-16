import { EntryPreviewItem } from "./EntryPreviewItem";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/EntryPreviewItem",
	component: EntryPreviewItem,
	tags: ["autodocs"],
	args: {
		entry: {
			id: "1",
			content: "This is a sample journal entry content that shows how the preview looks.",
			comments: [],
			createdAt: "2023-01-01T12:00:00Z",
		},
	},
} satisfies Meta<typeof EntryPreviewItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithComments: Story = {
	args: {
		entry: {
			id: "2",
			content: "This entry has comments attached to it.",
			comments: [
				{
					id: "comment-1",
					content: "This is a comment",
					createdAt: "2023-01-01T12:30:00Z",
				},
			],
			createdAt: "2023-01-01T12:00:00Z",
		},
	},
};

export const LongContent: Story = {
	args: {
		entry: {
			id: "3",
			content: "This is a very long journal entry that will demonstrate how the component handles content that exceeds the line clamp limit. It should show an ellipsis after three lines and truncate the rest of the content to maintain a clean preview format.",
			comments: [],
			createdAt: "2023-01-01T15:30:00Z",
		},
	},
};