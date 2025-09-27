import type { Meta, StoryObj } from "@storybook/react-vite";
import { EntryDateCard } from "./entry-date-card";

const meta = {
	component: EntryDateCard,
	tags: ["autodocs"],
	args: {
		date: "2023-01-15T12:00:00Z",
		children: (
			<div className="p-2 text-lightgray">Sample content goes here</div>
		),
	},
} satisfies Meta<typeof EntryDateCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithMultipleEntries: Story = {
	args: {
		children: (
			<div className="space-y-2">
				<div className="p-2 text-lightgray">First entry content</div>
				<div className="p-2 text-lightgray">Second entry content</div>
				<div className="p-2 text-lightgray">Third entry content</div>
			</div>
		),
	},
};

export const WeekendDate: Story = {
	args: {
		date: "2023-01-14T12:00:00Z", // Saturday
		children: <div className="p-2 text-lightgray">Weekend entry content</div>,
	},
};

export const FirstOfMonth: Story = {
	args: {
		date: "2023-02-01T12:00:00Z",
		children: <div className="p-2 text-lightgray">First day of February</div>,
	},
};
