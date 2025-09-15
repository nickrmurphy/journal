import { useState } from "react";
import viteLogo from "/electron-vite.animate.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Button } from "@journal/ui";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a
					href="https://electron-vite.github.io"
					target="_blank"
					rel="noopener"
				>
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noopener">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<Button />
			<div className="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
