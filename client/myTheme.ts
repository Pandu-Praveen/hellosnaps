
import type { CustomThemeConfig } from "@skeletonlabs/tw-plugin";

export const myCustomTheme: CustomThemeConfig = {
    name: "my-custom-theme",
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		"--theme-font-family-heading": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "4px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "255 255 255",
		"--on-success": "255 255 255",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "0 0 0",
		// =~= Theme Colors  =~=
		// primary | #0069FF 
		"--color-primary-50": "217 233 255", // #d9e9ff
		"--color-primary-100": "204 225 255", // #cce1ff
		"--color-primary-200": "191 218 255", // #bfdaff
		"--color-primary-300": "153 195 255", // #99c3ff
		"--color-primary-400": "77 150 255", // #4d96ff
		"--color-primary-500": "0 105 255", // #0069FF
		"--color-primary-600": "0 95 230", // #005fe6
		"--color-primary-700": "0 79 191", // #004fbf
		"--color-primary-800": "0 63 153", // #003f99
		"--color-primary-900": "0 51 125", // #00337d
		// secondary | #4F46E5 
		"--color-secondary-50": "229 227 251", // #e5e3fb
		"--color-secondary-100": "220 218 250", // #dcdafa
		"--color-secondary-200": "211 209 249", // #d3d1f9
		"--color-secondary-300": "185 181 245", // #b9b5f5
		"--color-secondary-400": "132 126 237", // #847eed
		"--color-secondary-500": "79 70 229", // #4F46E5
		"--color-secondary-600": "71 63 206", // #473fce
		"--color-secondary-700": "59 53 172", // #3b35ac
		"--color-secondary-800": "47 42 137", // #2f2a89
		"--color-secondary-900": "39 34 112", // #272270
		// tertiary | #121212 
		"--color-tertiary-50": "219 219 219", // #dbdbdb
		"--color-tertiary-100": "208 208 208", // #d0d0d0
		"--color-tertiary-200": "196 196 196", // #c4c4c4
		"--color-tertiary-300": "160 160 160", // #a0a0a0
		"--color-tertiary-400": "89 89 89", // #595959
		"--color-tertiary-500": "18 18 18", // #121212
		"--color-tertiary-600": "16 16 16", // #101010
		"--color-tertiary-700": "14 14 14", // #0e0e0e
		"--color-tertiary-800": "11 11 11", // #0b0b0b
		"--color-tertiary-900": "9 9 9", // #090909
		// success | #34c759 
		"--color-success-50": "225 247 230", // #e1f7e6
		"--color-success-100": "214 244 222", // #d6f4de
		"--color-success-200": "204 241 214", // #ccf1d6
		"--color-success-300": "174 233 189", // #aee9bd
		"--color-success-400": "113 216 139", // #71d88b
		"--color-success-500": "52 199 89", // #34c759
		"--color-success-600": "47 179 80", // #2fb350
		"--color-success-700": "39 149 67", // #279543
		"--color-success-800": "31 119 53", // #1f7735
		"--color-success-900": "25 98 44", // #19622c
		// warning | #ff9500 
		"--color-warning-50": "255 239 217", // #ffefd9
		"--color-warning-100": "255 234 204", // #ffeacc
		"--color-warning-200": "255 229 191", // #ffe5bf
		"--color-warning-300": "255 213 153", // #ffd599
		"--color-warning-400": "255 181 77", // #ffb54d
		"--color-warning-500": "255 149 0", // #ff9500
		"--color-warning-600": "230 134 0", // #e68600
		"--color-warning-700": "191 112 0", // #bf7000
		"--color-warning-800": "153 89 0", // #995900
		"--color-warning-900": "125 73 0", // #7d4900
		// error | #ff3b30 
		"--color-error-50": "255 226 224", // #ffe2e0
		"--color-error-100": "255 216 214", // #ffd8d6
		"--color-error-200": "255 206 203", // #ffcecb
		"--color-error-300": "255 177 172", // #ffb1ac
		"--color-error-400": "255 118 110", // #ff766e
		"--color-error-500": "255 59 48", // #ff3b30
		"--color-error-600": "230 53 43", // #e6352b
		"--color-error-700": "191 44 36", // #bf2c24
		"--color-error-800": "153 35 29", // #99231d
		"--color-error-900": "125 29 24", // #7d1d18
		// surface | #F7f7f7 
		"--color-surface-50": "254 254 254", // #fefefe
		"--color-surface-100": "253 253 253", // #fdfdfd
		"--color-surface-200": "253 253 253", // #fdfdfd
		"--color-surface-300": "252 252 252", // #fcfcfc
		"--color-surface-400": "249 249 249", // #f9f9f9
		"--color-surface-500": "247 247 247", // #F7f7f7
		"--color-surface-600": "222 222 222", // #dedede
		"--color-surface-700": "185 185 185", // #b9b9b9
		"--color-surface-800": "148 148 148", // #949494
		"--color-surface-900": "121 121 121", // #797979
		
	}
};


