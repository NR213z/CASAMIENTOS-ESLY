/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                champagne: '#C5A059',
                'champagne-light': '#F2E8D5',
                'champagne-dark': '#A68341',
                cream: '#FAF9F6',
                ivory: '#FFFFFF',
                'silk-gray': '#9E9A95',
                dark: '#1F1C1B',
                charcoal: '#33302E',
                'off-white': '#F9F8F6',
                muted: '#7A7570',
                border: '#E8E4DF',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Lato"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
