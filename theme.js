document.addEventListener('DOMContentLoaded', () => {
  // get the dom elements
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // check localstorage for the theme
  const pastTheme = localStorage.getItem('theme');
  if (pastTheme) {
    body.classList.add(pastTheme);
    themeToggle.textContent = pastTheme === 'light-mode' ? '☀️' : '🌙'; // sun or moon
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    // switch mased on the current theme
    if (body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light-mode');
      themeToggle.textContent = '☀️';
    } else {
      localStorage.setItem('theme', 'dark-mode');
      themeToggle.textContent = '🌙';
    }
  });
});
