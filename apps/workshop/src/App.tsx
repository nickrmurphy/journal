import React, { useState } from "react";
import { modules } from "./samples";

export default function App() {
	const [currentKey, setCurrentKey] = useState<keyof typeof modules>(
		Object.keys(modules)[0] as keyof typeof modules,
	);
	
	const mod = modules[currentKey];
	const samples = Object.entries(mod).filter(([k]) => k !== "default");
	const [currentSample, setCurrentSample] = useState<string>(
		samples[0]?.[0] ?? ""
	);

	const meta = mod.default;
	
	const handleModuleChange = (key: keyof typeof modules) => {
		setCurrentKey(key);
		const newMod = modules[key];
		const newSamples = Object.entries(newMod).filter(([k]) => k !== "default");
		setCurrentSample(newSamples[0]?.[0] ?? "");
	};

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
				{Object.keys(modules).map((k) => {
					const moduleKey = k as keyof typeof modules;
					const moduleSamples = Object.entries(modules[moduleKey]).filter(([key]) => key !== "default");
					return (
						<div key={k}>
							<button
								type="button"
								onClick={() => handleModuleChange(moduleKey)}
								style={{
									display: "block",
									margin: "4px 0",
									background: currentKey === moduleKey ? "#f0f0f0" : "none",
									border: "none",
									cursor: "pointer",
									fontFamily: "monospace",
									fontWeight: "bold",
								}}
							>
								{k}
							</button>
							{currentKey === moduleKey && (
								<div style={{ marginLeft: 16 }}>
									{moduleSamples.map(([sampleName]) => (
										<button
											key={sampleName}
											type="button"
											onClick={() => setCurrentSample(sampleName)}
											style={{
												display: "block",
												margin: "2px 0",
												background: currentSample === sampleName ? "#e0e0e0" : "none",
												border: "none",
												cursor: "pointer",
												fontFamily: "monospace",
												fontSize: "0.9em",
											}}
										>
											{sampleName}
										</button>
									))}
								</div>
							)}
						</div>
					);
				})}
			</aside>
			<main style={{ padding: 16 }}>
				<h2 style={{ fontFamily: "monospace" }}>{meta.title}</h2>
				{currentSample && (() => {
					const sample = samples.find(([name]) => name === currentSample)?.[1];
					if (!sample) return null;
					
					const Render =
						("render" in sample ? sample.render : null) ??
						((props: Record<string, unknown>) => React.createElement(meta.component, props));
					const args = { ...(meta.args ?? {}), ...(sample.args ?? {}) };
					return (
						<div style={{ marginBottom: 24 }}>
							<h4 style={{ fontFamily: "monospace" }}>{currentSample}</h4>
							<Render {...args} />
						</div>
					);
				})()}
			</main>
		</div>
	);
}
