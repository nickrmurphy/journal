import { DownloadSimpleIcon, ExportIcon } from "@phosphor-icons/react";
import { Menu } from "../shared/Menu";

type DataMenuProps = {
	onExport?: () => void;
	onImport?: () => void;
};

export const DataMenu = ({ onExport, onImport }: DataMenuProps) => {
	return (
		<Menu.Content>
			<Menu.Item value="export" onClick={onExport}>
				<ExportIcon /> Export
			</Menu.Item>
			<Menu.Item value="import" onClick={onImport}>
				<DownloadSimpleIcon /> Import
			</Menu.Item>
		</Menu.Content>
	);
};
