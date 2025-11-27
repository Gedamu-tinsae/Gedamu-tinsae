const { getTheme } = require('../theme');

function formatValue(value, suffix = '') {
  if (value === 'N/A') return 'N/A';
  return `${value}${suffix}`;
}

function cleanRepo(value) {
  if (!value || value === 'N/A') return 'N/A';
  return value.length > 22 ? `${value.slice(0, 19)}...` : value;
}

function createActivityInsightsCard(stats) {
  const theme = getTheme();
  const items = [
    { label: 'Current Streak', value: formatValue(stats.currentStreak, ' days') },
    { label: 'Longest Streak', value: formatValue(stats.longestStreak, ' days') },
    { label: 'Last Contribution', value: stats.lastContributionDate || 'N/A' },
    { label: 'Last Active Repo', value: cleanRepo(stats.lastActiveRepo) },
  ];

  const rows = items
    .map((item, index) => {
      const x = index % 2;
      const y = Math.floor(index / 2);
      const translateX = 20 + x * 180;
      const translateY = 50 + y * 75;

      return `
        <g transform="translate(${translateX}, ${translateY})">
          <rect x="0" y="0" width="160" height="60" rx="8" fill="${theme.cardBackground}" stroke="${theme.stroke}" />
          <text x="10" y="20" font-size="12" fill="${theme.muted}" font-family="Segoe UI, Ubuntu, Sans-Serif">${item.label}</text>
          <text x="10" y="38" font-size="14" fill="${theme.value}" font-family="Segoe UI, Ubuntu, Sans-Serif">${item.value}</text>
        </g>`;
    })
    .join('\n');

  return `
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" class="container">
    <style>
      .bg { fill: ${theme.background}; }
      .card-bg { fill: ${theme.cardBackground}; stroke: ${theme.stroke}; }
      .header { font: bold 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.header}; }
    </style>
    <rect width="100%" height="100%" rx="8" ry="8" class="bg"/>
    <rect x="5" y="5" width="390" height="190" rx="8" ry="8" class="card-bg"/>
    <text x="20" y="32" class="header">Activity Insights</text>
    ${rows}
  </svg>`;
}

module.exports = {
  createActivityInsightsCard,
};
