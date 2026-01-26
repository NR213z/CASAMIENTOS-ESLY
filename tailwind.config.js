/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: '#D4AF37',
                'gold-light': '#F3E5AB',
                dark: '#121212',
                charcoal: '#2C2C2C',
                'off-white': '#F9F9F9',
                'text-light': '#777777',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Lato"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
