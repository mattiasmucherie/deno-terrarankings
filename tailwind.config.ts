import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bunker": {
          "50": "#f4f6f7",
          "100": "#e3e8ea",
          "200": "#cad2d7",
          "300": "#a5b2bb",
          "400": "#788a98",
          "500": "#5d6e7d",
          "600": "#505d6a",
          "700": "#454f59",
          "800": "#3e454c",
          "900": "#373c42",
          "950": "#121417",
        },

        "rust": {
          "50": "#fff7ed",
          "100": "#ffecd4",
          "200": "#ffd5a8",
          "300": "#ffb771",
          "400": "#ff8e38",
          "500": "#fd6e12",
          "600": "#ee5308",
          "700": "#bc3908",
          "800": "#9d300f",
          "900": "#7e2a10",
          "950": "#441206",
        },

        "concrete": {
          "50": "#f8f8f8",
          "100": "#f2f2f2",
          "200": "#dcdcdc",
          "300": "#bdbdbd",
          "400": "#989898",
          "500": "#7c7c7c",
          "600": "#656565",
          "700": "#525252",
          "800": "#464646",
          "900": "#3d3d3d",
          "950": "#292929",
        },
        "midnight": {
          "50": "#ecf7ff",
          "100": "#ddf0ff",
          "200": "#c2e3ff",
          "300": "#9dd0ff",
          "400": "#76b1ff",
          "500": "#5691fe",
          "600": "#376bf4",
          "700": "#2a57d8",
          "800": "#254bae",
          "900": "#264389",
          "950": "#0d162e",
        },
      },
      fontFamily: {
        "sansman": ["Enter Sansman", "Arial", "ui-sans-serif", "system-ui"],
      },
      blur: {
        xs: "2px",
      },
    },
  },
} satisfies Config;
