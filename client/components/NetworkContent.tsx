import { PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "./Button";
import { useNetworker } from "./NetworkProvider";

export const NetworkContent = () => {
	const { isLoading, deviceId, networker, connections } = useNetworker();

	const handleLink = () => {
		const peerId = prompt("Enter the ID of the device you want to connect to");
		if (typeof peerId === "string") {
			networker.connect(peerId, true).then(() => {
				console.log("Connected to peer:", peerId);
			});
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 rounded-xl bg-card p-2">
				<div className="flex items-center justify-between">
					<h2 className="p-2 font-semibold">Connections</h2>
					<Button variant="ghost" onClick={handleLink}>
						<PlusIcon />
					</Button>
				</div>
				<div className="space-y-1">
					{connections.length === 0 && (
						<div className="p-2 text-muted-foreground">No connections yet.</div>
					)}
					{connections.map((connection) => (
						<div
							key={connection.connectionId}
							className="flex items-center justify-between p-2"
						>
							<span className="font-medium">{connection.peer}</span>
						</div>
					))}
				</div>
			</div>
			{deviceId && (
				<div className="flex flex-col gap-4 rounded-xl bg-card p-4">
					<p className="text-center text-muted-foreground text-sm">
						To connect to this device, enter the ID found below.
					</p>
					<p className="select-text text-center text-muted-foreground text-xs">
						{deviceId}
					</p>
				</div>
			)}
		</div>
	);
};
