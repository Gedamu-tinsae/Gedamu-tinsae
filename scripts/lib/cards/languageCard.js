const { createPieChart } = require('./pieChart');
const { getTheme } = require('../theme');

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Kotlin: '#A97BFF',
  Swift: '#ffac45',
};

const FALLBACK_COLORS = ['#79c0ff', '#f85149', '#3fb950', '#d29922', '#a371f7', '#8b949e'];

function getLanguageColor(language, index) {
  return LANGUAGE_COLORS[language] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

function createLegend(languages) {
  const theme = getTheme();
  return languages
    .map((lang, index) => {
      const color = getLanguageColor(lang.name, index);
      return `
        <g transform="translate(210, ${70 + index * 22})">
          <rect x="0" y="-10" width="12" height="12" rx="2" fill="${color}"/>
          <text x="20" y="0" font-family="Segoe UI" font-size="12" fill="${theme.muted}">${lang.name} - ${lang.percentage}%</text>
        </g>`;
    })
    .join('\n');
}

function createReposPerLanguageCard(languages) {
  const topLanguages = languages.slice(0, 6);
  const theme = getTheme();

  return `
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" class="container">
    <style>
      .bg { fill: ${theme.background}; }
      .card-bg { fill: ${theme.cardBackground}; stroke: ${theme.stroke}; }
      .header { font: bold 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.header}; }
    </style>
    <rect width="100%" height="100%" rx="8" ry="8" class="bg"/>
    <rect x="5" y="5" width="390" height="190" rx="8" ry="8" class="card-bg"/>
    <text x="20" y="32" class="header">Languages Distribution</text>

    <g transform="translate(-40, 0)">
      ${createPieChart(topLanguages, getLanguageColor)}
    </g>

    ${createLegend(topLanguages)}
  </svg>`;
}

module.exports = {
  createReposPerLanguageCard,
};
