module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx,svelte}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
