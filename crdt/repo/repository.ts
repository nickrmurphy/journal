import { type DataConnection, Peer } from "peerjs";
import type { PeerId } from "../networking";
import type { Persister } from "../persistence";
import type { CRDTState, Entity } from "../state";
import { createStore } from "../state";
import type { Repository } from "./types";

export const createRepository = <T extends Entity>({
	collectionName,
	persister,
	deviceId,
	defaultConnections,
}: {
	collectionName: string;
	persister: Persister;
	deviceId: string;
	defaultConnections: PeerId[];
}): Repository<T> => {
	const subscribers = new Set<() => void>();
	const store = createStore<T>({ collectionName, persister });
	const connections = new Map<PeerId, DataConnection>();
	const peer = new Peer(deviceId);

	const registerConnection = (conn: DataConnection) => {
		conn.on("open", () => {
			connections.set(conn.peer, conn);
		});
		conn.on("close", () => {
			connections.delete(conn.peer);
		});
		conn.on("data", async (data) => {
			const message = data as { type: string; data: { state: CRDTState } };
			const changed = await store.merge(message.data.state);
			if (changed) {
				notify();
			}
		});
	};

	peer.on("open", (id) => {
		console.log("Peer connection opened:", id);
		defaultConnections.forEach((peerId) => {
			const conn = peer.connect(peerId);
			registerConnection(conn);
		});
	});

	peer.on("connection", (conn) => {
		connections.set(conn.peer, conn);
		registerConnection(conn);
	});

	const notify = async (broadcast = false) => {
		subscribers.forEach((fn) => fn());
		if (broadcast) {
			const state = await store.getState();
			connections.forEach((conn) => {
				conn.send({ type: "send-state", data: { state } });
			});
		}
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
			return new Promise<void>((resolve, reject) => {
				if (connections.has(peerId)) {
					return resolve();
				}

				const conn = peer.connect(peerId);

				conn.on("error", (err) => {
					console.error("Connection error:", err);
					return reject(err);
				});

				registerConnection(conn);
			});
		},
	};
};
