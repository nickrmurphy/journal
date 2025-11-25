import { Button } from "@/components/shared";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

const meta = {
	component: Button,
	tags: ["autodocs"],
	args: { onClick: fn(), children: "Button" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const OutlineBlack: Story = {
	args: {
		variant: "outline-black",
	},
};

export const SolidYellow: Story = {
	args: {
		variant: "solid-yellow",
	},
};

export const OutlineYellow: Story = {
	args: {
		variant: "outline-yellow",
	},
};
