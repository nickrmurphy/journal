import type { Networker, PeerId } from "../networking";
import type { Persister } from "../persistence";
import type { Entity } from "../state";
import { createStore } from "../state";
import type { Repository } from "./types";

export const createRepository = <T extends Entity>({
	collectionName,
	persister,
	networker: _networker,
}: {
	collectionName: string;
	persister: Persister;
	networker: Networker;
}): Repository<T> => {
	const subscribers = new Set<() => void>();
	const store = createStore<T>({ collectionName, persister });
	const networker = (() => {
		_networker.onConnect(async (peer) => {
			const state = await store.getState();
			_networker.sendTo(peer, { type: "send-state", data: { state } });
		});
		_networker.listen("send-state", async (_, data) => {
			const changed = await store.merge(data.state);
			if (changed) {
				notify();
			}
		});
		return _networker;
	})();

	const notify = async (broadcast = false) => {
		if (broadcast) {
			const state = await store.getState();
			networker.send({ type: "send-state", data: { state } });
		}
		subscribers.forEach((fn) => fn());
	};

	return {
		materialize: () => store.materialize(),
		mutate: async (data) => {
			const changed = await store.mutate(data);
			if (changed) {
				notify(true);
			}
		},
		subscribe: (fn: () => void) => {
			subscribers.add(fn);
			return () => {
				subscribers.delete(fn);
			};
		},
		connect: (peerId: PeerId) => {
			networker.connect(peerId);
		},
	};
};
