import type { State } from "../core/types";
import type { Store } from ".";

export type NetworkProvider = {
	broadcastState: (state: State) => void;
	onReceiveState: (listener: (state: State) => void) => () => void;
	onConnection: (
		listener: (event: "add" | "remove", peerId: string) => void,
	) => () => void;
};

export const withNetworking = <T>(
	store: Store<T>,
	{
		networkProvider,
	}: {
		networkProvider: NetworkProvider;
	},
) => {
	networkProvider.onReceiveState((state: State) => {
		store.mergeState(state);
	});

	store.on("mutate", () => {
		networkProvider.broadcastState(store.getState());
	});

	return store;
};
