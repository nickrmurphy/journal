import { DemoButton } from "@journal/components";
import type { Sample, SampleMeta } from "./sample-types";

const meta: SampleMeta<typeof DemoButton> = {
	title: "UI/Button",
	component: DemoButton,
	args: { children: "Click me", disabled: false },
};
export default meta;

export const Default: Sample<typeof DemoButton> = {};
export const Disabled: Sample<typeof DemoButton> = { args: { disabled: true } };
