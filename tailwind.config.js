module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        customBiru  : '#DCF2F1',
        customBiru2 : '#7FC7D9',
        customBiru3 : '#365486',
        customBiru4 : '#0F1035',
        customBiru5 : '#0B4251',
        customBiru6 : '#87BBD7',
        customKuning : '#F2C864',

      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};