import type { Meta, StoryObj } from "@storybook/react-vite";
import { HomePage } from "./TodayPage";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "pages/TodayPage",
	component: HomePage,
	tags: ["autodocs"],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};
