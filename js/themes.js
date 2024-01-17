const themes = [
  "css/themes/the-classic.css",
  "css/themes/the-classic-negated.css",
  "css/themes/noras.css",
];

let currentThemeIndex = 0;
let themeChanged = false;

function applyTheme() {
  const savedThemeIndex = parseInt(localStorage.getItem('currentThemeIndex'));

  if (!themeChanged && !isNaN(savedThemeIndex)) {
    // Load the saved theme only if the theme hasn't been changed
    currentThemeIndex = savedThemeIndex;
  }

  const currentTheme = themes[currentThemeIndex];
  document.getElementById('stylesheet').setAttribute('href', currentTheme);
}

function toggleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  themeChanged = true; // Set the flag to indicate a theme change
  applyTheme();
}

document.addEventListener('DOMContentLoaded', applyTheme);