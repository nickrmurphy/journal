import { useNetworker } from "./NetworkProvider";

export const NetworkContent = () => {
	const { isLoading, deviceId, networker } = useNetworker();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const peerId = formData.get("peerId");
		if (typeof peerId === "string") {
			networker.connect(peerId).then(() => {
				console.log("Connected to peer:", peerId);
			});
		}
	};

	const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		networker.pingConnections();
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1>Network Page</h1>
			<span>
				Device ID:
				<p className="select-text">{deviceId}</p>
			</span>
			<form onSubmit={handleSubmit}>
				<input type="text" name="peerId" placeholder="Enter peer id..." />
				<button type="submit">Connect</button>
			</form>
			<form onSubmit={handleSend}>
				<button type="submit">Sync</button>
			</form>
		</div>
	);
};
