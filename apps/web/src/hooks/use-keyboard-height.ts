import { useEffect } from "react";

/**
 * Hook that sets up keyboard height detection using the Visual Viewport API.
 *
 * Uses window.innerHeight - window.visualViewport.height to detect keyboard height.
 * Listens to resize and scroll events on window.visualViewport.
 *
 * Sets the --keyboard-height CSS variable on document.documentElement.
 */
export const useKeyboardHeight = () => {
	useEffect(() => {
		if (!window.visualViewport) {
			// Fallback: if Visual Viewport API is not supported, set to 0
			document.documentElement.style.setProperty("--keyboard-height", "0px");
			return;
		}

		const updateKeyboardHeight = () => {
			if (!window.visualViewport) return;

			const keyboardHeight = Math.max(
				0,
				window.innerHeight - window.visualViewport.height,
			);

			document.documentElement.style.setProperty(
				"--keyboard-height",
				`${keyboardHeight}px`,
			);
		};

		// Set initial height
		updateKeyboardHeight();

		// Listen to visualViewport resize events
		window.visualViewport.addEventListener("resize", updateKeyboardHeight);
		window.visualViewport.addEventListener("scroll", updateKeyboardHeight);

		return () => {
			if (!window.visualViewport) return;

			window.visualViewport.removeEventListener("resize", updateKeyboardHeight);
			window.visualViewport.removeEventListener("scroll", updateKeyboardHeight);
		};
	}, []);
};
