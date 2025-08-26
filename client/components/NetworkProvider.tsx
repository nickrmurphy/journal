import type { Networker } from "@crdt/network";
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
	deviceId: string | null;
} | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);
	const [deviceId, setDeviceId] = useState<string | null>(null);

	useEffect(() => {
		const initialize = () => {
			networker.getDeviceId().then((id) => {
				setDeviceId(id);
				setIsLoading(false);
			});
		};

		initialize();
	}, []);

	const contextValue = useMemo(
		() => ({ networker, isLoading, deviceId }),
		[isLoading, deviceId],
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
