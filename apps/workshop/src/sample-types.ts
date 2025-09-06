import type { JSX } from "react";

export type SampleMeta<C = any> = {
	title: string; // e.g. "UI/Button"
	component: C; // React component
	args?: Record<string, unknown>;
};

export type Sample<C = any> = {
	render?: (args: Record<string, unknown>) => JSX.Element;
	args?: Record<string, unknown>;
};
