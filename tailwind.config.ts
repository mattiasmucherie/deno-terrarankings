import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        licorice: "#17000c",
        chocolateCosmos: "#55000b",
        ivory: "#ffffeb",
        "ivory-100": "#290005",
        engineeringOrange: "#c70102",
        flame: "#e5571b",
        princetonOrange: "#ff9839",
        "guardsman-red": {
          "50": "#fff0f0",
          "100": "#ffdddd",
          "200": "#ffc1c1",
          "300": "#ff9697",
          "400": "#ff5a5b",
          "500": "#ff2728",
          "600": "#fb0708",
          "700": "#c70102",
          "800": "#af0506",
          "900": "#900c0d",
          "950": "#4f0000",
        },
        "trinidad": {
          "50": "#fef6ee",
          "100": "#fdebd7",
          "200": "#f9d4af",
          "300": "#f5b57c",
          "400": "#f08b47",
          "500": "#ec6c23",
          "600": "#e5571b",
          "700": "#b73f17",
          "800": "#92331a",
          "900": "#762c18",
          "950": "#3f140b",
        },
        "gondola": {
          "50": "#fbf5f1",
          "100": "#f6e7de",
          "200": "#ecccbc",
          "300": "#e0a891",
          "400": "#d27e65",
          "500": "#c86047",
          "600": "#ba4c3c",
          "700": "#9b3a33",
          "800": "#7d322f",
          "900": "#652b29",
          "950": "#1e0b0b",
        },
      },
    },
  },
} satisfies Config;
