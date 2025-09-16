import { AsideLayout } from "./AsideLayout";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Layouts/AsideLayout",
	component: AsideLayout,
	parameters: {
		layout: "fullscreen",
	}
} satisfies Meta<typeof AsideLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		aside: (
			<div className="space-y-4 bg-black">
				<h2 className="text-lg font-semibold">Sidebar Content</h2>
				<div className="space-y-2">
					<div className="p-3 bg-gray-100 rounded">Navigation Item 1</div>
					<div className="p-3 bg-gray-100 rounded">Navigation Item 2</div>
					<div className="p-3 bg-gray-100 rounded">Navigation Item 3</div>
				</div>
			</div>
		),
		main: (
			<div className="space-y-6 bg-black">
				<h1 className="text-3xl font-bold">Main Content Area</h1>
				<div className="prose max-w-none">
					<p>This is the main content area of the desktop layout. It spans 4 columns of the 6-column grid and has a max width constraint for optimal reading.</p>
					<p>The layout uses a fixed positioning system that takes up the full viewport height.</p>
				</div>
			</div>
		),
	},
};

export const WithScrollableContent: Story = {
	args: {
		aside: (
			<div className="space-y-4 bg-black">
				<h2 className="text-lg font-semibold">Long Sidebar</h2>
				{Array.from({ length: 20 }, (_, i) => (
					<div key={i} className="p-3 bg-gray-100 rounded">
						Sidebar Item {i + 1}
					</div>
				))}
			</div>
		),
		main: (
			<div className="space-y-6 bg-black">
				<h1 className="text-3xl font-bold">Scrollable Main Content</h1>
				{Array.from({ length: 50 }, (_, i) => (
					<div key={i} className="p-4 border rounded">
						<h3 className="font-semibold">Content Block {i + 1}</h3>
						<p>This demonstrates how the layout handles overflow with scrollable content in both the aside and main areas.</p>
					</div>
				))}
			</div>
		),
	},
};
