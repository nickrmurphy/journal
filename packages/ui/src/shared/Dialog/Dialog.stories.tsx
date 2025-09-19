import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog.Root> = {
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
				<Dialog.Body>
					<Dialog.Title>Notifications</Dialog.Title>
					<Dialog.Description>
						You are all caught up. Good job!
					</Dialog.Description>
				</Dialog.Body>
				<Dialog.Footer>
					<div className="flex justify-end w-full">
						<Dialog.Close>Close</Dialog.Close>
					</div>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	),
};

export const WithScrollableContent: Story = {
	render: () => (
		<Dialog.Root>
			<Dialog.Trigger>View long content</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Body>
					<Dialog.Title>Terms and Conditions</Dialog.Title>
					<Dialog.Description>
						Please review the following terms carefully.
					</Dialog.Description>
					<div className="mt-4 space-y-4">
						{Array.from({ length: 20 }, (_, i) => (
							<p key={i} className="text-sm text-gray-300">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
								in reprehenderit in voluptate velit esse cillum dolore eu fugiat
								nulla pariatur.
							</p>
						))}
					</div>
				</Dialog.Body>
				<Dialog.Footer>
					<div className="flex justify-between w-full gap-2">
						<Dialog.Close className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded">
							Decline
						</Dialog.Close>
						<Dialog.Close className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded">
							Accept
						</Dialog.Close>
					</div>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	),
};
