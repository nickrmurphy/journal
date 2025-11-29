import { Dialog as ArkDialog } from "@ark-ui/solid/dialog";
import { cx } from "cva";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";

const Backdrop = ArkDialog.Backdrop;
const Positioner = ArkDialog.Positioner;
const Root = ArkDialog.Root;
const Trigger = ArkDialog.Trigger;
const Close = ArkDialog.CloseTrigger;
const Title = ArkDialog.Title;
const Description = ArkDialog.Description;

const Content = (props: { children: JSX.Element }) => (
	<Portal>
		<Backdrop class={cx("fixed inset-0 bg-black/70 backdrop-blur-xs")} />
		<Positioner class="fixed inset-0 flex items-end justify-center">
			<ArkDialog.Content
				class={cx(
					"flex flex-col w-full h-[calc(90vh-var(--safe-top))] rounded-t-2xl bg-white/5 backdrop-blur-3xl p-6 border border-b-0",
					"data-[state=open]:animate-[slideUpFromBottom_150ms_ease-out] data-[state=open]:translate-y-0",
					"data-[state=closed]:animate-[slideDownToBottom_150ms_ease-in]",
					"translate-y-full",
				)}
			>
				{props.children}
			</ArkDialog.Content>
		</Positioner>
	</Portal>
);

const Body = (props: { children: JSX.Element }) => (
	<div class="flex-1 overflow-y-auto min-h-0">{props.children}</div>
);

const Toolbar = (props: { children: JSX.Element }) => (
	<div class="flex-shrink-0 pb-4 -mx-2 -mt-2 mb-2 border-b border-dashed">
		{props.children}
	</div>
);

export const Drawer = {
	Root,
	Portal,
	Backdrop,
	Positioner,
	Trigger,
	Close,
	Title,
	Description,
	Content,
	Body,
	Toolbar,
};
