import { type DataConnection, Peer } from "peerjs";
import type { Persister } from "../persistence";
import type { CRDTState } from "../state";
import type { Networker, PeerId } from "./types";

export type Message =
	| {
			type: "push";
			data: CRDTState;
	  }
	| {
			type: "pull";
			data: never;
	  }
	| {
			type: "ping";
			data: never;
	  };

export const createNetworker = (persister: Persister): Networker => {
	const connections: Map<PeerId, DataConnection> = new Map();
	let onConnectionCallback: () => void;
	let pushCallback: (data: CRDTState) => void;
	let pullCallback: () => CRDTState;

	const init = (async () => {
		let deviceId = await persister.get<string>("deviceId");
		if (!deviceId) {
			deviceId = crypto.randomUUID();
			await persister.set("deviceId", deviceId);
		}

		const peer = new Peer(deviceId);
		peer.on("connection", (conn) => {
			registerConnection(conn);
			conn.on("open", () => {
				onConnectionCallback();
			});
		});

		return { peer, deviceId };
	})();

	const registerConnection = (conn: DataConnection) => {
		conn.on("data", (data) => {
			const message = data as Message;
			switch (message.type) {
				case "push": {
					pushCallback(message.data);
					break;
				}
				case "pull": {
					const state = pullCallback();
					conn.send({
						type: "push",
						data: state,
					});
					break;
				}
				case "ping":
					console.log(
						`Ping message received on connection Id [${conn.connectionId}]  from peer Id [${conn.peer}]`,
					);
					break;
				default:
					console.log("Unexpected message received", message);
			}
		});

		conn.on("close", () => {
			connections.delete(conn.peer);
		});

		connections.set(conn.peer, conn);
	};

	const connect = async (peerId: string, pullOnOpen = false) => {
		const { peer } = await init;
		const conn = peer.connect(peerId);

		registerConnection(conn);

		if (pullOnOpen) {
			conn.on("open", () => {
				onConnectionCallback();
				conn.send({
					type: "pull",
				});
			});
		}
	};

	const sendState = (state: CRDTState) => {
		for (const connection of connections.values()) {
			connection.send({
				type: "sync",
				data: state,
			});
		}
	};

	const getDeviceId = async () => {
		const { deviceId } = await init;
		return deviceId;
	};

	const onPushMessage = (callback: (data: CRDTState) => void) => {
		pushCallback = callback;
	};

	const onPullMessage = (callback: () => CRDTState) => {
		pullCallback = callback;
	};

	const onConnection = (callback: () => void) => {
		onConnectionCallback = callback;
	};

	const pingConnections = async () => {
		for (const connection of connections.values()) {
			connection.send({
				type: "ping",
			});
		}
	};

	const getConnections = () => {
		return Array.from(connections.values());
	};

	return {
		connect,
		sendState,
		getDeviceId,
		getConnections,
		pingConnections,
		onPushMessage,
		onPullMessage,
		onConnection,
	};
};
