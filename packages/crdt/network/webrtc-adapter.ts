import Peer from "peerjs";
import type { State } from "../core/types";
import type { NetworkProvider } from "../store/with-network";
import { createConnectionManager } from "./connection-manager";

type Message =
	| {
			type: "state";
			data: State;
	  }
	| {
			type: "ping";
			data: null;
	  };

type WebRTCAdapter = NetworkProvider & {
	connect: (peerId: string) => void;
};

export const createWebRTCAdapter = (deviceId: string): WebRTCAdapter => {
	const peer = new Peer(deviceId);
	const connectionManager = createConnectionManager();
	let receiveStateHandler: ((state: State) => void) | null = null;
	let connectionHandler:
		| ((event: "add" | "remove", peerId: string) => void)
		| null = null;

	peer.on("connection", (conn) => {
		// Register the new connection
		connectionManager.add(conn.peer, conn);
		connectionHandler?.("add", conn.peer);

		// Remove connection on close
		conn.on("close", () => {
			connectionManager.remove(conn.peer);
			connectionHandler?.("remove", conn.peer);
		});

		// Handle incoming data
		conn.on("data", (data) => {
			const msg = data as Message;

			// Raise event on state message
			if (msg.type === "state" && receiveStateHandler) {
				receiveStateHandler(msg.data);
			}
		});
	});

	return {
		broadcastState: (state: State) => {
			connectionManager.getAll().forEach((conn) => {
				const msg: Message = { type: "state", data: state };
				conn.send(msg);
			});
		},
		onReceiveState: (listener: (state: State) => void) => {
			receiveStateHandler = listener;

			return () => {
				receiveStateHandler = null;
			};
		},
		onConnection: (
			listener: (event: "add" | "remove", peerId: string) => void,
		) => {
			connectionHandler = listener;

			return () => {
				connectionHandler = null;
			};
		},
		connect: (peerId: string) => {
			peer.connect(peerId);
		},
	};
};
