const themes = {
  dark: {
    background: '#0d1117',
    cardBackground: '#161b22',
    stroke: '#30363d',
    header: '#58a6ff',
    value: '#79c0ff',
    muted: '#8b949e',
    accent: '#58a6ff',
  },
  light: {
    background: '#ffffff',
    cardBackground: '#f5f5f5',
    stroke: '#d0d7de',
    header: '#0969da',
    value: '#1f2328',
    muted: '#57606a',
    accent: '#0969da',
  },
};

function getTheme() {
  const name = process.env.STATS_THEME || 'dark';
  return themes[name] || themes.dark;
}

module.exports = { getTheme };
