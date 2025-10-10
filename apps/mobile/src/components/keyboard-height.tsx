import { Keyboard } from "@capacitor/keyboard";
import { useEffect } from "react";

const setKeyboardHeightVar = (height: number) => {
	const html = document.getElementsByTagName("html");
	html[0]?.style.setProperty("--keyboard-height", `${height}px`);
};

export const KeyboardHeightListener = () => {
	useEffect(() => {
		const showListener = Keyboard.addListener("keyboardWillShow", (info) => {
			setKeyboardHeightVar(info.keyboardHeight);
		});

		return () => {
			showListener.then((handle) => {
				handle.remove();
			});
		};
	}, []);

	return null;
};
