import { LinkIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "./Button";
import { useNetworker } from "./NetworkProvider";

export const NetworkContent = () => {
	const { isLoading, deviceId, networker } = useNetworker();

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
			{deviceId && (
				<div className="bg-card rounded-xl p-4 flex flex-col gap-4">
					<h2 className="text-lg font-semibold p-2 mx-auto">
						Connect to this device
					</h2>
					<div className="bg-muted rounded-lg p-4 mx-auto flex">
						<QRCodeSVG value={deviceId} size={175} />
					</div>
					<p className="text-center text-sm text-muted-foreground">
						Scan this QR code with your device to connect, or enter the ID found
						below.
					</p>
					<p className="text-center text-xs select-text text-muted-foreground">
						{deviceId}
					</p>
				</div>
			)}
			<div className="bg-card rounded-xl p-4 flex flex-col gap-4">
				<h2 className="text-lg font-semibold p-2 mx-auto">
					Connect to another device
				</h2>
				<Button variant="outline" disabled>
					<QrCodeIcon /> Scan QR Code
				</Button>
				<span className="text-center text-sm text-muted-foreground">
					- or -
				</span>
				<Button variant="outline" onClick={handleLink}>
					<LinkIcon /> Enter ID
				</Button>
			</div>
		</div>
	);
};
