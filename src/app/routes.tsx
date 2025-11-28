import { Route } from "@solidjs/router";
import { Navigation } from "@/components/layout/navigation";
import { JournalPage } from "@/pages/journal";
import { SettingsPage } from "@/pages/settings";

export const AppRoutes = () => (
	<Route path="/" component={Navigation}>
		<Route path="/" component={JournalPage} />
		<Route path="/settings" component={SettingsPage} />
	</Route>
);
