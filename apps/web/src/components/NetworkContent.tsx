import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import { chain } from "@journal/fn";
import { downloadFile } from "@/utils/file-downloader";
import { type Entry, entryStore, getDeviceId } from "../collections/entries";
import { triggerJsonFileSelection } from "../utils/json-importer";
import { Button } from "./Button";
import { useConnections } from "./Connections";

export const NetworkContent = () => {
	const { connections, connect } = useConnections();

	const handleLink = () => {
		const peerId = prompt("Enter the ID of the device you want to connect to");
		const finalPeerId = peerId?.trim();
		if (finalPeerId) {
			connect(finalPeerId);
		}
	};

	const handleExport = () => {
		const stringifiedRecords = chain(entryStore.get())
			.pipe((records) => JSON.stringify(records))
			.get();
		downloadFile(
			stringifiedRecords,
			`journal-${new Date().toISOString()}.json`,
		);
	};

	const handleImport = async () => {
		const result = await triggerJsonFileSelection();
		if (result.success) {
			entryStore.set(result.data as Record<string, Entry>);
		}
	};

	return (
		<div className="flex h-full flex-col gap-4">
			<div className="flex flex-col gap-4 rounded-xl bg-card p-2">
				<div className="flex items-center justify-between">
					<h2 className="p-2 font-semibold">Connections</h2>
					<Button variant="ghost" onClick={handleLink}>
						<PlusIcon />
					</Button>
				</div>
				<div className="space-y-1">
					{connections.length === 0 && (
						<div className="p-2 text-center text-muted-foreground">
							No connections yet.
						</div>
					)}
					{connections.map((connection) => (
						<div
							key={connection}
							className="flex items-center justify-between p-2"
						>
							<span className="font-medium">{connection}</span>
						</div>
					))}
				</div>
				<div className="flex flex-col gap-2 rounded-lg border p-3">
					<p className="text-center text-muted-foreground text-xs">
						To connect to this device, enter the ID found below.
					</p>
					<p className="select-text text-center text-muted-foreground text-xs">
						{getDeviceId()}
					</p>
				</div>
			</div>
			<div className="mt-auto flex gap-4 rounded-xl bg-card p-4">
				<Button className="w-full" variant="outline" onClick={handleExport}>
					<ArrowUpTrayIcon />
					Export
				</Button>
				<Button className="w-full" variant="outline" onClick={handleImport}>
					<ArrowDownTrayIcon />
					Import
				</Button>
			</div>
		</div>
	);
};
