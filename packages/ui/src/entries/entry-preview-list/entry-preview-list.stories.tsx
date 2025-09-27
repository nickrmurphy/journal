import type { JournalEntry } from "@journal/core/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntryPreviewList } from "./entry-preview-list";

const mockEntries: JournalEntry[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440001",
		content:
			"Today was a productive day. I finished the quarterly report and started planning for next week's project kickoff.",
		comments: [
			{
				createdAt: "2023-12-15T10:00:00Z",
				content: "Remember to review the budget section before finalizing.",
				id: "550e8400-e29b-41d4-a716-446655440000",
			},
		],
		createdAt: "2023-12-15T09:30:00Z",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440002",
		content:
			"Had a great coffee meeting with Sarah to discuss the new marketing strategy. We brainstormed some innovative ideas.",
		comments: [],
		createdAt: "2023-12-15T14:15:00Z",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440003",
		content:
			"Reflected on the week's accomplishments. Small wins add up to big progress over time.",
		comments: [],
		createdAt: "2023-12-15T20:45:00Z",
	},
];

const mockEntriesYesterday: JournalEntry[] = [
	{
		id: "550e8400-e29b-41d4-a716-446655440004",
		content:
			"Morning workout felt great! Starting the day with exercise always sets a positive tone.",
		comments: [],
		createdAt: "2023-12-14T07:00:00Z",
	},
	{
		id: "550e8400-e29b-41d4-a716-446655440005",
		content:
			"Team meeting went well. Everyone is aligned on the project timeline and deliverables.",
		comments: [],
		createdAt: "2023-12-14T11:30:00Z",
	},
];

const meta = {
	component: EntryPreviewList,
	tags: ["autodocs"],
	args: {
		data: [
			{
				date: "2023-12-15T00:00:00Z",
				entries: mockEntries,
			},
		],
	},
} satisfies Meta<typeof EntryPreviewList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const MultipleDays: Story = {
	args: {
		data: [
			{
				date: "2023-12-15T00:00:00Z",
				entries: mockEntries,
			},
			{
				date: "2023-12-14T00:00:00Z",
				entries: mockEntriesYesterday,
			},
		],
	},
};

export const SingleEntry: Story = {
	args: {
		data: [
			{
				date: "2023-12-15T00:00:00Z",
				// biome-ignore lint/style/noNonNullAssertion: <static mock data>
				entries: [mockEntries[0]!],
			},
		],
	},
};

export const EmptyDay: Story = {
	args: {
		data: [
			{
				date: "2023-12-15T00:00:00Z",
				entries: [],
			},
		],
	},
};

export const WeekOfEntries: Story = {
	args: {
		data: [
			{
				date: "2023-12-15T00:00:00Z",
				entries: mockEntries,
			},
			{
				date: "2023-12-14T00:00:00Z",
				entries: mockEntriesYesterday,
			},
			{
				date: "2023-12-13T00:00:00Z",
				entries: [
					{
						id: "550e8400-e29b-41d4-a716-446655440006",
						content:
							"Spent the evening reading a fascinating book about productivity systems.",
						comments: [],
						createdAt: "2023-12-13T19:30:00Z",
					},
				],
			},
			{
				date: "2023-12-12T00:00:00Z",
				entries: [
					{
						id: "550e8400-e29b-41d4-a716-446655440007",
						content:
							"Cooking experiment: tried a new recipe for Thai curry. It turned out amazing!",
						comments: [],
						createdAt: "2023-12-12T18:00:00Z",
					},
					{
						id: "550e8400-e29b-41d4-a716-446655440008",
						content:
							"Late night coding session. Finally solved that tricky algorithm problem.",
						comments: [],
						createdAt: "2023-12-12T23:45:00Z",
					},
				],
			},
		],
	},
};
