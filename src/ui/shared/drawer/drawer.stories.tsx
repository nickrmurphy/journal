import type { Meta, StoryObj } from "@storybook/react-vite";
import { Drawer } from "./drawer";

const meta: Meta<typeof Drawer.Root> = {
	subcomponents: { ...Drawer },
	tags: ["autodocs"],
	args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Drawer.Root>
			<Drawer.Trigger>Open Drawer</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Toolbar>
					<div className="flex justify-between items-center w-full">
						<Drawer.Title>Drawer Title</Drawer.Title>
						<Drawer.Close>Close</Drawer.Close>
					</div>
				</Drawer.Toolbar>
				<Drawer.Body>
					<Drawer.Description>
						This is a drawer that slides up from the bottom and takes up 90% of
						the viewport.
					</Drawer.Description>
				</Drawer.Body>
			</Drawer.Content>
		</Drawer.Root>
	),
};
