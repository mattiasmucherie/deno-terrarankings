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
      },
    },
  },
} satisfies Config;
