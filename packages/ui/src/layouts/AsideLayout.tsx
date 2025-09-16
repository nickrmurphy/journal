export const AsideLayout = (props: {
	aside: React.ReactNode;
	main: React.ReactNode;
}) => (
	<div className="fixed inset-0 grid grid-cols-6">
		<aside className="col-span-2 overflow-y-auto p-3">{props.aside}</aside>
		<main className="col-span-4 overflow-y-auto p-3">
			<div className="mx-auto flex w-full max-w-3xl flex-col">{props.main}</div>
		</main>
	</div>
);
