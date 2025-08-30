import { type DataConnection, Peer } from "peerjs";
import type { PeerId } from "../networking";
import type { Persister } from "../persistence";
import type { Entity } from "../state";
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
			peer.connect(peerId);
		});
	});

	peer.on("connection", (conn) => {
		console.log("New connection:", conn.peer);
		connections.set(conn.peer, conn);
		conn.on("close", () => {
			connections.delete(conn.peer);
		});
		conn.on("data", (data) => {
			console.log("Received data:", data);
		});
	});

	const notify = async (broadcast = false) => {
		if (broadcast) {
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
				conn.on("data", (data) => {
					console.log("Received data:", data);
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
