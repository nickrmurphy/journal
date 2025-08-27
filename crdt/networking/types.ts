import type { DataConnection } from "peerjs";
import type { CRDTState } from "../types";

export type Networker = {
	connect: (peerId: string, pullOnOpen?: boolean) => Promise<void>;
	getDeviceId: () => Promise<string>;
	sendState: (state: CRDTState) => void;
	onPushMessage: (callback: (data: CRDTState) => void) => void;
	onPullMessage: (callback: () => CRDTState) => void;
	onConnection: (callback: () => void) => void;
	pingConnections: () => Promise<void>;
	getConnections: () => DataConnection[]; // For future use, e.g. listing connections
};

export type PeerId = string;
