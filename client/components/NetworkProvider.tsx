import type { Networker } from "@crdt/network";
import type { DataConnection } from "peerjs";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { networker } from "../collections/entries";

const NetworkContext = createContext<{
	networker: Networker;
	isLoading: boolean;
	connections: DataConnection[];
	deviceId: string | null;
} | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);
	const [connections, setConnections] = useState<DataConnection[]>([]);
	const [deviceId, setDeviceId] = useState<string | null>(null);

	useEffect(() => {
		const initialize = () => {
			networker.getDeviceId().then((id) => {
				setDeviceId(id);
				setIsLoading(false);
				networker.onConnection(() => {
					setConnections(networker.getConnections());
				});
			});
		};

		initialize();
	}, []);

	const contextValue = useMemo(
		() => ({ networker, isLoading, deviceId, connections }),
		[isLoading, deviceId, connections],
	);

	return (
		<NetworkContext.Provider value={contextValue}>
			{children}
		</NetworkContext.Provider>
	);
}

export function useNetworker() {
	const context = useContext(NetworkContext);
	if (!context) {
		throw new Error("useNetworker must be used within a NetworkProvider");
	}
	return context;
}
