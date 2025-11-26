import { Route, Router } from "@solidjs/router";
import { JournalRoute } from "./routes/index";
import { RootLayout } from "./routes/root";
import { SettingsRoute } from "./routes/settings";

export const AppRouter = () => {
	return (
		<Router root={RootLayout}>
			<Route path="/" component={JournalRoute} />
			<Route path="/settings" component={SettingsRoute} />
			<Route path="*" component={JournalRoute} />
		</Router>
	);
};
