import type { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize, KeyboardStyle } from "@capacitor/keyboard";

const config: CapacitorConfig = {
	appId: "com.byearlybird.journal",
	appName: "Journal by Early Bird",
	webDir: "dist",
	plugins: {
		Keyboard: {
			resize: KeyboardResize.None,
			style: KeyboardStyle.Default,
			resizeOnFullScreen: true,
		},
	},
	server: {
		url: "http://192.168.4.29:5173/",
		cleartext: true,
	},
};

export default config;
