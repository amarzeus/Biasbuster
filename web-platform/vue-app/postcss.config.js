const tailwindcss = require('tailwindcss');
const postcssNesting = require('postcss-nesting');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssNesting,
    tailwindcss,
    autoprefixer
  ]
}; 