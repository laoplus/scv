/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./renderer/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                "dialog-appear": "dialog-appear 0.2s ease-out",
            },
            keyframes: {
                "dialog-appear": {
                    "0%": {
                        opacity: 0,
                        transform: "translateX(20px)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translateX(0)",
                    },
                },
            },
        },
        fontFamily: {
            sans: ["Inter var", "sans-serif"],
        },
    },
    plugins: [],
};
