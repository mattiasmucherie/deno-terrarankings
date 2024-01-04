import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        licorice: "#17000c",
        ivory: "#ffffeb",
        // new design
        "black-pearl": {
          "50": "#eff7ff",
          "100": "#dfefff",
          "200": "#b7e0ff",
          "300": "#77c7ff",
          "400": "#2eacff",
          "500": "#0391f4",
          "600": "#0072d1",
          "700": "#005aa9",
          "800": "#014d8b",
          "900": "#074073",
          "950": "#021120",
        },
        "carnation": {
          "50": "#fff1f2",
          "100": "#ffe1e3",
          "200": "#ffc8cb",
          "300": "#ffa1a6",
          "400": "#fe6b73",
          "500": "#f74a53",
          "600": "#e41e28",
          "700": "#c0151e",
          "800": "#9e161d",
          "900": "#83191f",
          "950": "#48070a",
        },
        "fantasy": {
          "50": "#f9f7f7",
          "100": "#f5f0f0",
          "200": "#eadede",
          "300": "#dac7c7",
          "400": "#c3a6a6",
          "500": "#ac8787",
          "600": "#956d6d",
          "700": "#7b5a5a",
          "800": "#684c4c",
          "900": "#594343",
          "950": "#2e2121",
        },
        "brandy-punch": {
          "50": "#fdf9ed",
          "100": "#f8edcd",
          "200": "#f1d896",
          "300": "#eabf5f",
          "400": "#e5a83a",
          "500": "#d78521",
          "600": "#c4681b",
          "700": "#a34a1a",
          "800": "#853b1b",
          "900": "#6d311a",
          "950": "#3e180a",
        },
      },
      fontFamily: {
        "sansman": ["Enter Sansman", "Arial", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        neon:
          "0 0 5px theme('colors.carnation.200'), 0 0 20px theme('colors.carnation.700')",
      },
    },
  },
} satisfies Config;
