import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08111f",
        panel: "#101b2d",
        line: "#21314b",
        cyan: "#38d9ff",
        amber: "#f5b84b",
        danger: "#ff5b6e"
      },
      boxShadow: {
        forensic: "0 22px 70px rgba(2, 8, 23, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
