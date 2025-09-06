import React, { useState } from "react";
import { modules } from "./samples";

export default function App() {
	const [currentKey, setCurrentKey] = useState<keyof typeof modules>(
		Object.keys(modules)[0] as keyof typeof modules,
	);

	const mod = modules[currentKey];
	const meta = mod.default;
	const samples = Object.entries(mod).filter(([k]) => k !== "default");

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "250px 1fr",
				height: "100vh",
			}}
		>
			<aside style={{ borderRight: "1px solid #ddd", padding: 12 }}>
				<h3 style={{ fontFamily: "monospace" }}>Samples</h3>
				{Object.keys(modules).map((k) => (
					<button
						key={k}
						type="button"
						onClick={() => setCurrentKey(k as keyof typeof modules)}
						style={{
							display: "block",
							margin: "4px 0",
							background: "none",
							border: "none",
							cursor: "pointer",
							fontFamily: "monospace",
						}}
					>
						{k}
					</button>
				))}
			</aside>
			<main style={{ padding: 16 }}>
				<h2 style={{ fontFamily: "monospace" }}>{meta.title}</h2>
				{samples.map(([name, sample]) => {
					const Render =
						("render" in sample ? sample.render : null) ??
						((props: any) => React.createElement(meta.component, props));
					const args = { ...(meta.args ?? {}), ...(sample.args ?? {}) };
					return (
						<div key={name} style={{ marginBottom: 24 }}>
							<h4 style={{ fontFamily: "monospace" }}>{name}</h4>
							<Render {...args} />
						</div>
					);
				})}
			</main>
		</div>
	);
}
