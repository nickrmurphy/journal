import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="pt-[var(--safe-top)] pb-[var(--safe-bottom)] px-2">
			Hello "/settings"!
		</div>
	);
}
