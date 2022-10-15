/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["**/*.{html,js}"],
  theme: {
    screens: {
      xs: {
        max: '380px'
      },

      sm: {
        max: '640px'
      },

      lg: {
        max: '768px'
      },

      m: {
        max: '1050px'
      },

      xl: {
        max: '1280px'
      },

      '2xl': {
        max: '1350px'
      }
    },

    extend: {
      colors: {
        main: {
          darker: '#4f0075',
          DEFAULT: '#9300d9',
          lighter: '#ad00ff'
        }
      },

      backgroundImage: {
        'radial-gradient-dark': 'radial-gradient(circle, rgba(79,0,117,0.65) 0%, rgba(52,36,57,1) 90%)',
        'radial-gradient-light': 'radial-gradient(circle, rgba(79,0,117,0.4) 16%, rgba(255,255,255,0.9) 76%)'
      },

      fontFamily: {
        'work-sans': 'Work Sans',
        'roboto-slab': 'Roboto Slab'
      },

      minWidth: {
        '1': '100px',
        '1.5': '150px',
        '2': '200px',
        '2.5': '250px',
        '3': '300px',
        '3.5': '350px',
        '4': '400px',
        '4.5': '450px',
        '5': '500px',
        '5.5': '550px',
        '6': '600px',
        '6.5': '650px',
        '7': '700px',
        '7.5': '750px',
      }
    },
  },

  darkMode: 'class',

  plugins: [],
}
