/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0071CE', // Walmart Blue
                secondary: '#FFC220', // Walmart Yellow (Spark)
                accent: '#F47321', // Walmart Orange (Search Button)
                gray: {
                    100: '#f4f4f4', // Light background
                    200: '#e6e6e6',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
