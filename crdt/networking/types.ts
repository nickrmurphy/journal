import type { Message } from "../repo";

export type Networker = {
	connect: (peerId: PeerId) => Promise<void>;
	send: (message: Message) => void;
	sendTo: (peerId: PeerId, message: Message) => void;
	onConnect: (callback: (peerId: PeerId) => void) => void;
	onDisconnect: (callback: (peerId: PeerId) => void) => void;
	listen: <K extends Message["type"]>(
		type: K,
		callback: (
			peerId: PeerId,
			data: Extract<Message, { type: K }>["data"],
		) => void,
	) => void;
};

export type PeerId = string;
