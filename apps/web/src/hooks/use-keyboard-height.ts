import { useEffect } from "react";

/**
 * Detects if the device has touch capabilities
 */
const isTouchDevice = (): boolean => {
	return (
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-expect-error - msMaxTouchPoints is not in the types but exists on IE
		navigator.msMaxTouchPoints > 0
	);
};

/**
 * Hook that sets up keyboard height detection using the Visual Viewport API.
 *
 * For touch devices:
 * - Uses window.innerHeight - window.visualViewport.height to detect keyboard
 * - Listens to resize events on window.visualViewport
 *
 * For non-touch devices:
 * - Sets height to 2/3 of the screen (positions dialog at top 1/3)
 *
 * Sets the --keyboard-height CSS variable on document.documentElement
 */
export const useKeyboardHeight = () => {
	useEffect(() => {
		const isTouch = isTouchDevice();

		// For non-touch devices, set a fixed height
		if (!isTouch) {
			const height = Math.round((window.innerHeight * 2) / 3);
			document.documentElement.style.setProperty(
				"--keyboard-height",
				`${height}px`,
			);
			return;
		}

		// For touch devices, use Visual Viewport API
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
