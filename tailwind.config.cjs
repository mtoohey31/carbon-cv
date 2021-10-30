module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx,svelte}"],
  darkMode: false, // or 'media' or 'class'
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
