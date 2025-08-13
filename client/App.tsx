import { Dialog } from "@base-ui-components/react";
import type { PanInfo } from "motion/react";
import { animate, motion, useMotionValue } from "motion/react";
import React, {
	type FC,
	type PropsWithChildren,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { CreateEntryDialog } from "./components/CreateEntryDialog";
import { EntryDialog } from "./components/EntryDialog";
import { PastEntries } from "./components/PastEntries";
import { TodayEntries } from "./components/TodayEntries";
import { TodayHeader } from "./components/TodayHeader";

const Nav = () => (
	<div className="flex justify-end fixed bottom-[calc(var(--safe-bottom)+var(--spacing)*4)] inset-x-4">
		<CreateEntryDialog />
	</div>
);

// A vertically scrollable page surface
const Page: FC<PropsWithChildren> = ({ children }) => (
	<main className="bg-background w-[calc(100%-theme(spacing.4))] gap-5 flex flex-col rounded-xl shadow flex-1 m-auto min-h-[calc(100vh-theme(spacing.4))] my-2 p-2 overflow-auto pb-20">
		{children}
	</main>
);

/**
 * SwipePager renders pages side-by-side and allows horizontal swipe between them.
 * All pages remain mounted; we transform an inner track. Only one fits the viewport at a time.
 */
const SwipePager: FC<{
	activeIndex: number;
	onChange: (index: number) => void;
	children: React.ReactNode[]; // variable length (>=1)
}> = ({ activeIndex, onChange, children }) => {
	const trackRef = useRef<HTMLDivElement | null>(null);
	const initialWidth = typeof window !== "undefined" ? window.innerWidth : 0;
	const [width, setWidth] = useState<number>(initialWidth);
	// Start at the correct offset so there's no initial slide animation.
	const x = useMotionValue(-activeIndex * initialWidth);
	const didAnimateRef = useRef(false);
	const pageCount = children.length;

	// Keep x in sync when activeIndex changes (snap animation)
	useEffect(() => {
		const target = -activeIndex * width;
		// If this is the first run (mount) and x already equals target, don't animate.
		if (!didAnimateRef.current) {
			if (x.get() !== target) x.set(target);
			didAnimateRef.current = true;
			return;
		}
		animate(x, target, {
			type: "spring",
			stiffness: 400,
			damping: 38,
			mass: 0.6,
		});
	}, [activeIndex, width, x]);

	// Update width on resize
	useEffect(() => {
		const handle = () => {
			const w = window.innerWidth;
			setWidth(w);
			// Instantly reposition track on resize (no animation jitter)
			x.set(-activeIndex * w);
		};
		window.addEventListener("resize", handle);
		return () => window.removeEventListener("resize", handle);
	}, [activeIndex, x]);

	// Decide target page on drag end
	const handleDragEnd = useCallback(
		(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
			const { offset, velocity } = info;
			const threshold = width * 0.2; // 20% swipe or velocity flick
			let nextIndex = activeIndex;
			// Swiping left (negative offset.x means finger moved left? Actually offset.x becomes negative when dragging left)
			if (offset.x <= -threshold || velocity.x <= -600) {
				nextIndex = Math.min(activeIndex + 1, pageCount - 1);
			} else if (offset.x >= threshold || velocity.x >= 600) {
				nextIndex = Math.max(activeIndex - 1, 0);
			}
			if (nextIndex !== activeIndex) onChange(nextIndex);
			else {
				// Snap back
				animate(x, -activeIndex * width, {
					type: "spring",
					stiffness: 500,
					damping: 45,
				});
			}
		},
		[activeIndex, onChange, width, x, pageCount],
	);

	return (
		<div
			className="relative w-full h-full overflow-hidden"
			style={{ touchAction: "pan-y" /* allow vertical scroll inside pages */ }}
		>
			<motion.div
				ref={trackRef}
				className="flex h-full"
				style={{ x, width: width * pageCount }}
				drag="x"
				dragConstraints={{ left: -(pageCount - 1) * width, right: 0 }}
				dragElastic={0.05}
				dragMomentum={false}
				onDragEnd={handleDragEnd}
			>
				{children.map((child, i) => {
					const stableKey =
						React.isValidElement(child) && child.key != null
							? child.key
							: `p-${i}`;
					return (
						<div
							key={stableKey as string}
							className="w-screen shrink-0 flex flex-col"
						>
							{child}
						</div>
					);
				})}
			</motion.div>
			{/* Pager dots */}
			<div className="pointer-events-none absolute bottom-4 left-0 right-0 flex justify-center gap-2">
				{children.map((child, i) => {
					const stableKey =
						React.isValidElement(child) && child.key != null
							? child.key
							: `p-${i}`;
					return (
						<div
							key={`dot-${stableKey as string}`}
							className={
								"h-2 w-2 rounded-full transition-colors " +
								(i === activeIndex ? "bg-foreground" : "bg-foreground/30")
							}
						/>
					);
				})}
			</div>
		</div>
	);
};

function App() {
	const [detailId, setDetailId] = useState<string | null>(null);
	// Default to center page (Today) => index 1
	const [pageIndex, setPageIndex] = useState(1);

	return (
		<div className="w-full h-full fixed inset-0 flex flex-col">
			<SwipePager activeIndex={pageIndex} onChange={setPageIndex}>
				{/* Index 0: Previously */}
				<>
					<Page>
						<section className="space-y-2">
							<motion.section
								key="past-entries"
								layout
								className="space-y-2"
								exit={{ opacity: 0, height: 0 }}
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								transition={{
									type: "spring",
									stiffness: 300,
									damping: 24,
									mass: 0.4,
								}}
							>
								<PastEntries onSelect={setDetailId} />
							</motion.section>
						</section>
					</Page>
				</>
				{/* Index 1: Today (default) */}
				<>
					<Page>
						<section>
							<TodayHeader />
							<TodayEntries onSelectEntry={setDetailId} />
						</section>
					</Page>
				</>
				{/* Index 2: Placeholder */}
				<>
					<Page>
						<section className="h-full flex items-center justify-center text-center opacity-70">
							<div>
								<p className="text-lg font-medium">Coming Soon</p>
								<p className="text-sm">This is a placeholder page.</p>
							</div>
						</section>
					</Page>
				</>
			</SwipePager>
			<Nav />
			<Dialog.Root
				open={detailId !== null}
				onOpenChange={() => {
					setDetailId(null);
				}}
			>
				<EntryDialog entryId={detailId} />
			</Dialog.Root>
		</div>
	);
}

export default App;
