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
				<div className="flex flex-col gap-4 rounded-xl bg-card p-4">
					<h2 className="mx-auto p-2 font-semibold text-lg">
						Connect to this device
					</h2>
					<div className="mx-auto flex rounded-lg bg-muted p-4">
						<QRCodeSVG value={deviceId} size={175} />
					</div>
					<p className="text-center text-muted-foreground text-sm">
						Scan this QR code with your device to connect, or enter the ID found
						below.
					</p>
					<p className="select-text text-center text-muted-foreground text-xs">
						{deviceId}
					</p>
				</div>
			)}
			<div className="flex flex-col gap-4 rounded-xl bg-card p-4">
				<h2 className="mx-auto p-2 font-semibold text-lg">
					Connect to another device
				</h2>
				<div className="flex flex-col space-y-2">
					<Button variant="outline" disabled>
						<QrCodeIcon /> Scan QR Code
					</Button>
					<span className="text-center text-muted-foreground text-sm">
						- or -
					</span>
					<Button variant="outline" onClick={handleLink}>
						<LinkIcon /> Enter ID
					</Button>
				</div>
			</div>
		</div>
	);
};
