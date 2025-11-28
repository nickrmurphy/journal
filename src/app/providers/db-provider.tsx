import { createSignal, type ParentComponent, Show } from "solid-js";
import { db } from "@/lib/db";

export const DbProvider: ParentComponent = (props) => {
	const [dbReady, setDbReady] = createSignal(false);

	db.init().then(() => setDbReady(true));

	return <Show when={dbReady()}>{props.children}</Show>;
};
