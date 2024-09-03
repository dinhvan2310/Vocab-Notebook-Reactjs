/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryDark: {
          DEFAULT: '#4255ff',
          hover: '#423ed8',
          avtive: '#1f1c8b',
          light: '#2e3856'
        },
        secondaryDark: {
          DEFAULT: 'rgb(255, 220, 98)',
          hover: 'rgb(255, 220, 28)',
          active: 'rgb(255, 204, 0)',
        },
        bgDark: {
          DEFAULT: '#2c2c2c',
          hover: '#252424',
          active: '#1e1e1e',
        },
        textDark: {
          DEFAULT: '#f6f7fb',
          secondary: '#b8bbbf',
        },
        borderDark: {
          DEFAULT: '#686D76',
        },
        disableDark: {
          DEFAULT: '#3c3f41',
        },


        primaryLight: {
          DEFAULT: '#4255ff',
          hover: '#423ed8',
          avtive: '#1f1c8b',
          light: '#edefff'
        },
        secondaryLight: {
          DEFAULT: 'rgb(255, 220, 98)',
          hover: 'rgb(255, 220, 28)',
          active: 'rgb(255, 204, 0)',
        },
        bgLight: {
          DEFAULT: '#ffffff',
          hover: '#f7f8fc',
          active: '#edeff4',
        },
        textLight: {
          DEFAULT: '#282e3e',
          secondary: '#6b7c93',
        },
        borderLight: {
          DEFAULT: '#d9dde8',
        },
        disableLight: {
          DEFAULT: '#d9dde8',
        },


        white: '#ffffff',
        black: '#282e3e',
        red: {
          DEFAULT: '#F5004F',
          hover: '#FF6969',
          active: '#FF0000',
        },
      },
      boxShadow: {
        light: '0 0 8px 0 #d9dde8',
        dark: '0 0 8px 0 #686D76',
      },
      keyframes: {
        fadeInCenter: {
          from: {
            opacity: 0,
            transform: 'translate(-50%, -10px) scale(0.98)'
          },
          to: {
            opacity: 1,
            transform: 'translate(-50%, 0px) scale(1)'
          },
        },
        fadeIn: {
          from: {
            opacity: 0,
            transform: 'translateY(-10px) scale(0.98)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0px) scale(1)'
          }
        }

      },
      animation: {
        fadeInCenter: 'fadeInCenter 0.3s ease-in-out',
        fadeIn: 'fadeIn 0.3s ease-in-out'
      }
    },
  },
  plugins: [],
}