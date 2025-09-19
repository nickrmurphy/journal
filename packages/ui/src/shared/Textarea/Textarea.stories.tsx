import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
	component: Textarea,
	tags: ["autodocs"],
	args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Textarea
			rows={4}
			placeholder="What's on your mind?"
			className="w-64 p-2 border border-lightgray rounded"
		/>
	),
};