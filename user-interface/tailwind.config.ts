/** @type {import('tailwindcss').Config} */

//--------------------------------------------------------

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    screens: {
      sm: '390px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1600px',
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Schibsted Grotesk', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
      },
      fontSize: {
        h2: ['48px', '56px'],
        h3: ['40px', '48px'],
        h4: ['32px', '40px'],
        h5: ['24px', '28px'],
        title: ['20px', '24px'],
        // base: ["16px", "24px"], //base
        base2: ['14px', '20px'], //sm
        hairline1: ['12px', '20px'],
        caption: ['12px', '16px'], //xs
        xxs: ['10px', '12px'],
      },
      colors: {
        auth: '#212121',
        primary: 'rgba(248, 248, 248, 0.95)',
        secondary: 'rgba(248, 248, 248, 0.7)',
        tertiary: 'rgba(248, 248, 248, 0.5)',
        background: {
          DEFAULT: 'rgba(40, 40, 40, 0.7)',
          secondary: 'rgba(40, 40, 40, 0.8)',
          third: 'rgba(40, 40, 40, 0.90)',
        },
        surface: {
          DEFAULT: '#282828B2',
          2: '#282828CC',
          3: '#282828E5',
          stack: '#12121299',
        },
        neutral1: {
          DEFAULT: '#FFFFFF',
          0: 'rgba(255, 255, 255, 0.00)',
          1: 'rgba(255, 255, 255, 0.01)',
          2: 'rgba(255, 255, 255, 0.02)',
          5: 'rgba(255, 255, 255, 0.05)',
          10: 'rgba(255, 255, 255, 0.10)',
          15: 'rgba(255, 255, 255, 0.15)',
          20: 'rgba(255, 255, 255, 0.20)',
          25: 'rgba(255, 255, 255, 0.25)',
          30: 'rgba(255, 255, 255, 0.30)',
          35: 'rgba(255, 255, 255, 0.35)',
          40: 'rgba(255, 255, 255, 0.40)',
          45: 'rgba(255, 255, 255, 0.45)',
          50: 'rgba(255, 255, 255, 0.50)',
          55: 'rgba(255, 255, 255, 0.55)',
          60: 'rgba(255, 255, 255, 0.60)',
          65: 'rgba(255, 255, 255, 0.65)',
          70: 'rgba(255, 255, 255, 0.70)',
          75: 'rgba(255, 255, 255, 0.75)',
          80: 'rgba(255, 255, 255, 0.80)',
          85: 'rgba(255, 255, 255, 0.85)',
          90: 'rgba(255, 255, 255, 0.90)',
          95: 'rgba(255, 255, 255, 0.95)',
        },
        neutral2: {
          DEFAULT: '#F8F8F8',
          1: 'rgba(248, 248, 248, 0.01)',
          2: 'rgba(248, 248, 248, 0.02)',
          3: 'rgba(248, 248, 248, 0.03)',
          5: 'rgba(248, 248, 248, 0.05)',
          10: 'rgba(248, 248, 248, 0.10)',
          15: 'rgba(248, 248, 248, 0.15)',
          20: 'rgba(248, 248, 248, 0.20)',
          25: 'rgba(248, 248, 248, 0.25)',
          30: 'rgba(248, 248, 248, 0.30)',
          35: 'rgba(248, 248, 248, 0.35)',
          40: 'rgba(248, 248, 248, 0.40)',
          45: 'rgba(248, 248, 248, 0.45)',
          50: 'rgba(248, 248, 248, 0.50)',
          55: 'rgba(248, 248, 248, 0.55)',
          60: 'rgba(248, 248, 248, 0.60)',
          65: 'rgba(248, 248, 248, 0.65)',
          70: 'rgba(248, 248, 248, 0.70)',
          75: 'rgba(248, 248, 248, 0.75)',
          80: 'rgba(248, 248, 248, 0.80)',
          85: 'rgba(248, 248, 248, 0.85)',
          90: 'rgba(248, 248, 248, 0.90)',
          95: 'rgba(248, 248, 248, 0.95)',
        },
        neutral3: {
          DEFAULT: '#282828',
          1: 'rgba(40, 40, 40, 0.01)',
          5: 'rgba(40, 40, 40, 0.05)',
          10: 'rgba(40, 40, 40, 0.10)',
          15: 'rgba(40, 40, 40, 0.15)',
          20: 'rgba(40, 40, 40, 0.20)',
          25: 'rgba(40, 40, 40, 0.25)',
          30: 'rgba(40, 40, 40, 0.30)',
          35: 'rgba(40, 40, 40, 0.35)',
          40: 'rgba(40, 40, 40, 0.40)',
          45: 'rgba(40, 40, 40, 0.45)',
          50: 'rgba(40, 40, 40, 0.50)',
          55: 'rgba(40, 40, 40, 0.55)',
          60: 'rgba(40, 40, 40, 0.60)',
          65: 'rgba(40, 40, 40, 0.65)',
          70: 'rgba(40, 40, 40, 0.70)',
          75: 'rgba(40, 40, 40, 0.75)',
          80: 'rgba(40, 40, 40, 0.80)',
          85: 'rgba(40, 40, 40, 0.85)',
          90: 'rgba(40, 40, 40, 0.90)',
          95: 'rgba(40, 40, 40, 0.95)',
        },
        neutral4: {
          DEFAULT: '#121212',
          1: 'rgba(18, 18, 18, 0.01)',
          5: 'rgba(18, 18, 18, 0.05)',
          10: 'rgba(18, 18, 18, 0.10)',
          15: 'rgba(18, 18, 18, 0.15)',
          20: 'rgba(18, 18, 18, 0.20)',
          25: 'rgba(18, 18, 18, 0.25)',
          30: 'rgba(18, 18, 18, 0.30)',
          35: 'rgba(18, 18, 18, 0.35)',
          40: 'rgba(18, 18, 18, 0.40)',
          45: 'rgba(18, 18, 18, 0.45)',
          50: 'rgba(18, 18, 18, 0.50)',
          55: 'rgba(18, 18, 18, 0.55)',
          60: 'rgba(18, 18, 18, 0.60)',
          65: 'rgba(18, 18, 18, 0.65)',
          70: 'rgba(18, 18, 18, 0.70)',
          75: 'rgba(18, 18, 18, 0.75)',
          80: 'rgba(18, 18, 18, 0.80)',
          85: 'rgba(18, 18, 18, 0.85)',
          90: 'rgba(18, 18, 18, 0.90)',
          95: 'rgba(18, 18, 18, 0.95)',
        },
        stroke: {
          25: 'rgba(255, 255, 255, 0.40)',
        },
        wine: '#BD3027',
      },
      width: {
        '18': '72px',
        '70': '280px',
        '80': '320px',
        '85': '340px',
        '120': '480px',
      },
      letterSpacing: {
        '-2percent': '-0.02em',
        '5percent': '0.05em',
      },
      backgroundImage: {
        'linear-mask':
          'linear-gradient(180deg, rgba(18, 18, 18, 0.20) 0%, rgba(18, 18, 18, 0.20) 85%, rgba(18, 18, 18, 0.00) 100%)',

        'linear-card':
          'linear-gradient(165deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0.40) 30%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0.10) 100%)',
        'linear-red':
          'linear-gradient(0deg, #BD3027 0%, #BD3027 100%, rgba(40, 40, 40, 0.70))',
        'linear-hover':
          'linear-gradient(0deg, rgba(248, 248, 248, 0.10) 0%, rgba(248, 248, 248, 0.10) 100%,rgba(40, 40, 40, 0.70))',
        'linear-object':
          'linear-gradient(180deg, rgba(248, 248, 248, 0.90) 0%, rgba(248, 248, 248, 0.30) 100%)',
        auth:
          'radial-gradient(at 37% 100%, #3b3bba30 0px, transparent 50%),' +
          'radial-gradient(at 61% 100%, #623d762b 0px, transparent 50%)',

        'modal-backdrop':
          'linear-gradient(0deg, rgba(248, 248, 248, 0.05) 0%, rgba(255, 255, 255, 0.05) 100%),rgba(40, 40, 40, 0.70)',
      },
      boxShadow: {
        card:
          '2px 4px 16px 0px rgba(248, 248, 248, 0.06) inset, ' +
          '0px 24px 24px -16px rgba(5, 5, 5, 0.09), ' +
          '0px 6px 13px 0px rgba(5, 5, 5, 0.10), ' +
          '0px 6px 4px -4px rgba(5, 5, 5, 0.10), ' +
          '0px 5px 1.5px -4px rgba(5, 5, 5, 0.25)',
        button: '2px 4px 16px 0 rgba(248, 248, 248, 0.06) inset',
        toggle:
          '0px 4px 4px 0px rgba(255, 255, 255, 0.05) inset, 0px 8px 16px -4px rgba(18, 18, 18, 0.20)',
        wrapper:
          '2px 4px 16px 0px rgba(248, 248, 248, 0.06) inset,' +
          '0px 54px 32px -16px rgba(5, 5, 5, 0.05),' +
          ' 0px 24px 24px -16px rgba(5, 5, 5, 0.09),' +
          ' 0px 6px 12px 0px rgba(5, 5, 5, 0.10),' +
          ' 0px 4px 4px -4px rgba(5, 5, 5, 0.10),' +
          '0px 0.5px 1.5px -4px rgba(5, 5, 5, 0.50)',
        'auth-card':
          '2px 4px 16px 0px rgba(248, 248, 248, 0.06) inset,' +
          '0px 24px 24px -16px rgba(5, 5, 5, 0.09),' +
          '0px 6px 13px 0px rgba(5, 5, 5, 0.10),' +
          '0px 6px 4px -4px rgba(5, 5, 5, 0.10),' +
          '0px 5px 1.5px -4px rgba(5, 5, 5, 0.25)',
        dropup:
          '0px 24px 32px -12px rgba(18, 18, 18, 0.10),' +
          '2px 4px 16px 0px rgba(248, 248, 248, 0.06) inset',
        stack:
          '2px 4px 16px 0px rgba(248, 248, 248, 0.06) inset,' +
          '0px 54px 32px -16px rgba(5, 5, 5, 0.05),' +
          '0px 24px 24px -16px rgba(5, 5, 5, 0.09),' +
          '0px 6px 12px 0px rgba(5, 5, 5, 0.10),' +
          '0px 4px 4px -4px rgba(5, 5, 5, 0.10),' +
          '0px 0.5px 1.5px -4px rgba(5, 5, 5, 0.50)',

        overlay:
          '2px 4px 16px 0px rgba(248, 248, 248, 0.06) inset,' +
          '0px 54px 32px -16px rgba(5, 5, 5, 0.05),' +
          '0px 24px 24px -16px rgba(5, 5, 5, 0.09),' +
          '0px 6px 12px 0px rgba(5, 5, 5, 0.1),' +
          '0px 4px 4px -4px rgba(5, 5, 5, 0.1),' +
          '0px 0.5px 1.5px -4px rgba(5, 5, 5, 0.5)',
      },
      backdropFilter: {
        'blur-50': 'blur(50px)',
        'blur-16': 'blur(16px)',
      },
      zIndex: {
        999999: '999999',
        99999: '99999',
        9999: '9999',
        999: '999',
        99: '99',
        9: '9',
        1: '1',
      },
      borderRadius: {
        button: '2rem',
      },
    },
  },
  plugins: [require('tailwindcss-filters')],
};
