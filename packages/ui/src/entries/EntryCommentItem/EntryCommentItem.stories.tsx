import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntryCommentItem } from "./EntryCommentItem";

const meta = {
	component: EntryCommentItem,
	tags: ["autodocs"],
	args: {
		comment: {
			id: "comment-1",
			content: "This is a sample comment on a journal entry.",
			createdAt: "2023-01-01T12:30:00Z",
		},
	},
} satisfies Meta<typeof EntryCommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const LongContent: Story = {
	args: {
		comment: {
			id: "comment-2",
			content:
				"This is a longer comment that demonstrates how the EntryCommentItem component handles more substantial text content. It shows proper text wrapping and maintains good readability with the established typography and spacing. This helps test the component's layout with extended thoughts and reflections that users might add as comments to their journal entries.",
			createdAt: "2023-01-01T14:00:00Z",
		},
	},
};

export const WithTimestamp: Story = {
	args: {
		comment: {
			id: "comment-3",
			content: "This comment displays with a timestamp below the content.",
			createdAt: "2023-01-01T16:30:00Z",
		},
		showTimestamp: true,
	},
};
