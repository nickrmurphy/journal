import { Route } from "@solidjs/router";
import { JournalRoute } from "./routes/index";
import { RootLayout } from "./routes/root";
import { SettingsRoute } from "./routes/settings";

export const AppRouter = () => {
	return (
		<Route path="/" component={RootLayout}>
			<Route path="/" component={JournalRoute} />
			<Route path="/settings" component={SettingsRoute} />
		</Route>
	);
};
