import { type DataConnection, Peer } from "peerjs";
import type { Message } from "../repo";
import type { Networker, PeerId } from "./types";

export const createPeerJsNetworker = (deviceId: string): Networker => {
	const peer = new Peer(deviceId);
	const connections: Map<PeerId, DataConnection> = new Map();
	const listeners: Map<Message["type"], (peerId: string, data: any) => void> =
		new Map();
	let handleConnect: ((peerId: string) => void) | null = null;
	let handleDisconnect: ((peerId: string) => void) | null = null;

	const handleMessage = (peerId: string, message: unknown) => {
		if (typeof message === "object" && message !== null) {
			const msg = message as Message;
			const listener = listeners.get(msg.type);
			if (listener) {
				listener(peerId, msg.data);
			}
		} else {
			console.warn("Received invalid message:", message);
		}
	};

	return {
		send: (message) => {
			for (const conn of connections.values()) {
				conn.send(message);
			}
		},
		sendTo: (peerId, message) => {
			const conn = connections.get(peerId);
			if (conn) {
				conn.send(message);
			} else {
				console.warn(
					`Tried to send a message of type '${message.type}' to ${peerId}, but no connection exists.`,
				);
			}
		},
		onConnect: (callback) => {
			handleConnect = callback;
		},
		onDisconnect: (callback) => {
			handleDisconnect = callback;
		},
		connect: async (peerId) => {
			const conn = peer.connect(peerId);
			conn.on("open", () => {
				connections.set(peerId, conn);
				handleConnect?.(peerId);
			});
			conn.on("data", (message) => {
				handleMessage(conn.peer, message);
			});
			conn.on("close", () => {
				connections.delete(peerId);
				handleDisconnect?.(peerId);
			});
		},
		listen: (type, callback) => {
			listeners.set(type, callback);

			return () => {
				listeners.delete(type);
			};
		},
	};
};
