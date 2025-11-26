import { Route, Switch } from "wouter";
import { JournalRoute } from "./routes/index";
import { RootLayout } from "./routes/root";
import { SettingsRoute } from "./routes/settings";

export const AppRouter = () => {
	return (
		<RootLayout>
			<Switch>
				<Route path="/" component={JournalRoute} />
				<Route path="/settings" component={SettingsRoute} />
			</Switch>
		</RootLayout>
	);
};
