import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog.Root> = {
	title: "Components/Dialog",
	subcomponents: { ...Dialog },
	tags: ["autodocs"],
	args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Dialog.Root>
			<Dialog.Trigger>View notifications</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Notifications</Dialog.Title>
				<Dialog.Description>
					You are all caught up. Good job!
				</Dialog.Description>
				<div className="flex justify-end">
					<Dialog.Close>Close</Dialog.Close>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	),
};
