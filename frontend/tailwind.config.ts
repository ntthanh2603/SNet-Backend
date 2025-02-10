/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Quét các tệp trong thư mục src
    "./src/components/**/*.{js,ts,jsx,tsx}", // Nếu bạn có thêm thư mục components
    "./node_modules/@shadcn/ui/**/*.js", // Nếu bạn sử dụng shadcn/ui
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
