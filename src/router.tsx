import { Route, Switch } from "wouter";
import { RootLayout } from "./routes/__root";
import { JournalRoute } from "./routes/index";
import { SettingsRoute } from "./routes/settings";

export const AppRouter = () => {
	return (
		<RootLayout>
			<Switch>
				<Route path="/" component={JournalRoute} />
				<Route path="/settings" component={SettingsRoute} />
				<Route>
					<JournalRoute />
				</Route>
			</Switch>
		</RootLayout>
	);
};
