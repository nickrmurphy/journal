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

	let stateCallback: (data: CRDTState) => void;

	const getCallback = () => {
		console.log("Getting state callback", stateCallback);
		return stateCallback;
	};

	const registerConnection = (conn: DataConnection) => {
		conn.on("data", (data) => {
			const message = data as Message;
			const stateCallback = getCallback();
			switch (message.type) {
				case "sync": {
					console.log("Received sync message:", message.data);
					if (stateCallback) {
						stateCallback(message.data);
					} else {
						console.log("No state callback set");
					}
					break;
				}
				case "ping":
					console.log("Received ping message on connection:", conn);
					break;
				default:
					console.log("Received unexpected message:", message);
			}
		});

		conn.on("close", () => {
			connections.delete(conn.peer);
		});

		connections.set(conn.peer, conn);
		console.log("Registered connection:", conn.peer, connections);
	};

	const connect = async (peerId: string) => {
		const { peer } = await init;
		const conn = peer.connect(peerId);

		registerConnection(conn);
	};

	const sendState = (state: CRDTState) => {
		console.log("Send state invoked", connections);
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
		console.log("Setting state callback", callback);
		stateCallback = callback;
	};

	const pingConnections = async () => {
		console.log("Pinging connections:", connections);
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
