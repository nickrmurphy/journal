import type { ModalCommonProps } from "../stores/modalStore";

interface PocModalProps extends ModalCommonProps {
	title?: string;
	message?: string;
}

export function PocModal({
	onClose,
	title = "Hello",
	message = "This is a POC modal.",
}: PocModalProps) {
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
			role="dialog"
			aria-modal="true"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
			tabIndex={-1}
		>
			<div
				className="min-w-64 max-w-md rounded-lg bg-black p-4 text-lightgray shadow-xl outline outline-darkgray"
				role="document"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
			>
				<div className="mb-3 text-lg font-semibold">{title}</div>
				<div className="mb-4 text-sm text-lightgray/80">{message}</div>
				<div className="flex justify-end gap-2">
					<button
						type="button"
						className="rounded-md bg-darkgray px-3 py-1 text-sm text-lightgray hover:bg-darkgray/80"
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
