// tailwind.config.js
export default {
    content: ["./src/**/*.{astro,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#0B4C7A",
                dark: "#042A51",
                accent: "#F85018"
            },
            fontFamily: {
                sans: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
            }
        }
    },
    plugins: []
};
