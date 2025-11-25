import type { Entry } from "@/core/schemas";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntryList } from "./entry-list";

const mockEntries: Entry[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		content:
			"Today was a productive day. I finished the quarterly report and started planning for next week's project kickoff.",
		createdAt: "2023-12-15T09:30:00Z",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		content:
			"Had a great coffee meeting with Sarah to discuss the new marketing strategy. We brainstormed some innovative ideas.",
		createdAt: "2023-12-15T14:15:00Z",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		content:
			"Reflected on the week's accomplishments. Small wins add up to big progress over time.",
		createdAt: "2023-12-15T20:45:00Z",
	},
];

const meta = {
	component: EntryList,
	tags: ["autodocs"],
	args: {
		entries: mockEntries,
	},
} satisfies Meta<typeof EntryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const SingleEntry: Story = {
	args: {
		// biome-ignore lint/style/noNonNullAssertion: <static mock data>
		entries: [mockEntries[0]!],
	},
};

export const EmptyList: Story = {
	args: {
		entries: [],
	},
};

export const ManyEntries: Story = {
	args: {
		entries: [
			...mockEntries,
			{
				id: "550e8400-e29b-41d4-a716-446655440004",
				content:
					"Evening reflection: grateful for today's opportunities and learning experiences.",
				createdAt: "2023-12-15T21:30:00Z",
			},
			{
				id: "550e8400-e29b-41d4-a716-446655440005",
				content:
					"Quick note: remember to follow up on the client proposal tomorrow.",
				createdAt: "2023-12-15T22:00:00Z",
			},
		],
	},
};
