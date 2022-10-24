import { defineConfig } from "vite";
import solid from "solid-start/vite";
import cloudflarePages from "solid-start-cloudflare-pages";
import UnoCss from "unocss/vite";
import presetUno from "@unocss/preset-uno";
import presetTypography from "@unocss/preset-typography";
import presetIcons from "@unocss/preset-icons";

export default defineConfig({
	plugins: [
		solid({
			adapter: cloudflarePages({}),
		}),

		UnoCss({
			presets: [presetUno(), presetIcons(), presetTypography()],
		}),
	],
});
