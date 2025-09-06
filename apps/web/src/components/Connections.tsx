import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { entryStore, networkProvider } from "@/collections/entries";

const ConnectionsContext = createContext<{
	connections: string[];
	connect: (peerId: string) => void;
} | null>(null);

export function ConnectionsProvider({ children }: { children: ReactNode }) {
	const [connections, setConnections] = useState<string[]>([]);

	useEffect(() => {
		const unsub = networkProvider.onConnection((event, peerId) => {
			const id = peerId.trim();
			if (!id) return;

			switch (event) {
				case "add":
					networkProvider.broadcastState(entryStore.getState());
					setConnections((prev) => (prev.includes(id) ? prev : [...prev, id]));
					break;
				case "remove":
					setConnections((prev) => prev.filter((c) => c !== id));
					break;
			}
		});

		return () => unsub();
	}, []);

	const contextValue = useMemo(
		() => ({ connections, connect: networkProvider.connect }),
		[connections],
	);

	return (
		<ConnectionsContext.Provider value={contextValue}>
			{children}
		</ConnectionsContext.Provider>
	);
}

export function useConnections() {
	const connections = useContext(ConnectionsContext);
	if (!connections) {
		throw new Error("useConnections must be used within a ConnectionsProvider");
	}
	return connections;
}
