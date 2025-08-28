import type { PeerId } from "@crdt/networking";
import type { CRDTState, Entity } from "@crdt/state";

export type Message =
	| {
			type: "ping";
			data: never;
	  }
	| {
			type: "send-state";
			data: { state: CRDTState };
	  };

export type Repository<T extends Entity> = {
	materialize: () => Promise<T[]>;
	mutate: (data: Partial<T> & { $id: string }) => void;
	subscribe: (fn: () => void) => () => void;
	connect: (peerId: PeerId) => void;
};
