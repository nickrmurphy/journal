import { Carousel } from "@ark-ui/react/carousel";
import {
	BookmarkSimpleIcon,
	ClockCounterClockwiseIcon,
	PenIcon,
	SunHorizonIcon,
} from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";
import { PastEntries } from "./past-entries";
import { TodayEntries } from "./today-entries";

const Navbar = (props: ComponentProps<typeof Carousel.IndicatorGroup>) => (
	<Carousel.IndicatorGroup
		{...props}
		className="fixed z-10 bottom-4 left-4 flex items-center justify-between gap-1.5 bg-lightgray/30 rounded-full p-0.5 transition-all"
	/>
);

const NavItem = (
	props: ComponentProps<typeof Carousel.Indicator> & { label: string },
) => (
	<Carousel.Indicator
		{...props}
		className="transition-all transition-discrete data-[current]:bg-black/40 flex items-center gap-1.5 rounded-full [&>svg]:size-4 [&:not([data-current])>[data-part=label]]:hidden px-3 py-2 active:scale-110 active:outline-1 active:outline-lightgray/20"
	>
		{props.children}
		<span data-part="label" className="transition-discrete text-sm">
			{props.label}
		</span>
	</Carousel.Indicator>
);

const ActionGroup = (props: { children: ReactNode }) => (
	<div className="fixed z-10 bottom-4 right-4">{props.children}</div>
);

const Page = (props: ComponentProps<typeof Carousel.Item>) => (
	<Carousel.Item {...props} className="p-2" />
);

function App() {
	return (
		<Carousel.Root defaultPage={1} slideCount={2}>
			<Carousel.ItemGroup className="fixed inset-0">
				<Page index={0}>
					<PastEntries />
				</Page>
				<Page index={1}>
					<TodayEntries />
				</Page>
				<Page index={2}>Eventually bookmarks and stuff</Page>
			</Carousel.ItemGroup>
			<Navbar>
				<NavItem index={0} label="History">
					<ClockCounterClockwiseIcon />
				</NavItem>
				<NavItem index={1} label="Today">
					<SunHorizonIcon />
				</NavItem>
				<NavItem index={2} label="Index">
					<BookmarkSimpleIcon />
				</NavItem>
				<ActionGroup>
					<button
						type="button"
						className="size-10 flex items-center bg-yellow/90 text-black rounded-full justify-center active:scale-110 transition-all"
					>
						<PenIcon className="size-5" />
					</button>
				</ActionGroup>
			</Navbar>
		</Carousel.Root>
	);
}

export default App;
