/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                champagne: '#D4AF7A',
                'champagne-light': '#F5EBD9',
                'champagne-dark': '#B8935A',
                cream: '#FAF7F2',
                ivory: '#FFFFF0',
                'silk-gray': '#8B8680',
                dark: '#2C2826',
                charcoal: '#3D3935',
                'off-white': '#FDFCFA',
                muted: '#8B8680',
                border: '#EBE8E3',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Lato"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
