import type { Persister } from "@crdt/persister";
import { type DataConnection, Peer } from "peerjs";
import type { CRDTState } from "./types";

export type Message =
	| {
			type: "sync";
			data: CRDTState;
	  }
	| {
			type: "ping";
			data: never;
	  };

export type Networker = {
	connect: (peerId: string) => Promise<void>;
	getDeviceId: () => Promise<string>;
	sendState: (state: CRDTState) => void;
	onReceiveState: (callback: (data: CRDTState) => void) => void;
	pingConnections: () => Promise<void>;
};

type PeerId = string;

export const createNetworker = (persister: Persister<string>): Networker => {
	const connections: Map<PeerId, DataConnection> = new Map();
	let stateCallback: (data: CRDTState) => void;

	const init = (async () => {
		let deviceId = await persister.get();
		if (!deviceId) {
			deviceId = crypto.randomUUID();
			await persister.set(deviceId);
		}

		const peer = new Peer(deviceId);
		peer.on("connection", (conn) => {
			registerConnection(conn);
		});

		return { peer, deviceId };
	})();

	const registerConnection = (conn: DataConnection) => {
		conn.on("data", (data) => {
			const message = data as Message;
			switch (message.type) {
				case "sync": {
					stateCallback(message.data);
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

	const connect = async (peerId: string) => {
		const { peer } = await init;
		const conn = peer.connect(peerId);

		registerConnection(conn);
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

	const onReceiveState = (callback: (data: CRDTState) => void) => {
		stateCallback = callback;
	};

	const pingConnections = async () => {
		for (const connection of connections.values()) {
			connection.send({
				type: "ping",
			});
		}
	};

	return {
		connect,
		sendState,
		getDeviceId,
		pingConnections,
		onReceiveState,
	};
};
