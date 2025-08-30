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

	peer.on("open", (id) => {
		console.log("Peer connection opened:", id);
		defaultConnections.forEach((peerId) => {
			const conn = peer.connect(peerId);
			conn.on("open", () => {
				connections.set(peerId, conn);
			});
			conn.on("close", () => {
				connections.delete(peerId);
			});
			conn.on("data", async (data) => {
				const message = data as { type: string; data: { state: CRDTState } };
				const changed = await store.merge(message.data.state);
				if (changed) {
					notify();
				}
				console.log("Received data:", data);
			});
		});
	});

	peer.on("connection", (conn) => {
		console.log("New connection:", conn.peer);
		connections.set(conn.peer, conn);
		conn.on("close", () => {
			connections.delete(conn.peer);
		});
		conn.on("data", async (data) => {
			const message = data as { type: string; data: { state: CRDTState } };
			const changed = await store.merge(message.data.state);
			if (changed) {
				notify();
			}
			console.log("Received data:", data);
		});
	});

	const notify = async (broadcast = false) => {
		if (broadcast) {
			console.log("Broadcasting state to peers:", connections);
			const state = await store.getState();
			connections.forEach((conn) => {
				conn.send({ type: "send-state", data: { state } });
			});
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
		connect: (peerId: PeerId) =>
			new Promise<void>((resolve, reject) => {
				if (connections.has(peerId)) {
					resolve();
					return;
				}

				console.log("Connecting to peer:", peerId);
				const conn = peer.connect(peerId);
				conn.on("close", () => {
					connections.delete(peerId);
				});
				conn.on("data", async (data) => {
					const message = data as { type: string; data: { state: CRDTState } };
					const changed = await store.merge(message.data.state);
					if (changed) {
						notify();
					}
				});
				conn.on("open", () => {
					connections.set(peerId, conn);
					resolve();
				});
				conn.on("error", (err) => {
					console.error("Connection error:", err);
					reject(err);
				});
			}),
	};
};
