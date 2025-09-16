import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntryItem } from "./EntryItem";

const meta = {
	title: "Components/EntryItem",
	component: EntryItem,
	tags: ["autodocs"],
	args: {
		entry: {
			id: "1",
			content:
				"This is a sample journal entry that demonstrates the full entry view.",
			comments: [],
			createdAt: "2023-01-01T12:00:00Z",
		},
	},
} satisfies Meta<typeof EntryItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithComments: Story = {
	args: {
		entry: {
			id: "2",
			content:
				"This entry has multiple comments to show how they are displayed.",
			comments: [
				{
					id: "comment-1",
					content: "This is the first comment on this entry.",
					createdAt: "2023-01-01T12:30:00Z",
				},
				{
					id: "comment-2",
					content: "This is a second comment with additional thoughts.",
					createdAt: "2023-01-01T13:00:00Z",
				},
			],
			createdAt: "2023-01-01T12:00:00Z",
		},
	},
};

export const LongEntry: Story = {
	args: {
		entry: {
			id: "3",
			content:
				"This is a longer journal entry that demonstrates how the component handles more substantial content. It shows the full text without truncation and maintains good readability with proper line spacing and typography. This helps demonstrate the layout for entries with more detailed thoughts and reflections.",
			comments: [
				{
					id: "comment-3",
					content: "A thoughtful comment on this longer entry.",
					createdAt: "2023-01-01T14:00:00Z",
				},
			],
			createdAt: "2023-01-01T13:30:00Z",
		},
	},
};
