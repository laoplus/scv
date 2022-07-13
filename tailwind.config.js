/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
    theme: {
        extend: {
            animation: {
                "dialog-appear": "dialog-appear 0.2s ease-in-out",
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
