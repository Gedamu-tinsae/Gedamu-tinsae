const { getTheme } = require('../theme');

const VALUE_FALLBACK = 'N/A';

function formatValue(value) {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value || VALUE_FALLBACK;
}

function createContributionStatsCard(stats) {
  const theme = getTheme();
  const {
    totalStars,
    totalCommits,
    totalPullRequests,
    totalIssues,
    contributedRepos,
    totalContributions,
  } = stats;

  const blocks = [
    { label: 'Stars', value: totalStars, color: '#f1e05a' },
    { label: 'Commits', value: totalCommits, color: '#7ee787' },
    { label: 'PRs', value: totalPullRequests, color: '#58a6ff' },
    { label: 'Issues', value: totalIssues, color: '#f85149' },
    { label: 'Contrib Repos', value: contributedRepos, color: '#d29922' },
    { label: 'Total Contributions', value: totalContributions, color: '#a371f7' },
  ];

  const rows = blocks.map((block, index) => {
    const x = index % 3;
    const y = Math.floor(index / 3);
    const translateX = 20 + x * 120;
    const translateY = 70 + y * 80;
    return `
      <g transform="translate(${translateX}, ${translateY})">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="${theme.cardBackground}" stroke="${theme.stroke}" />
        <text x="50" y="24" text-anchor="middle" font-size="18" fill="${block.color}" font-family="Segoe UI, Ubuntu, Sans-Serif">${formatValue(block.value)}</text>
        <text x="50" y="44" text-anchor="middle" font-size="12" fill="${theme.muted}" font-family="Segoe UI, Ubuntu, Sans-Serif">${block.label}</text>
      </g>`;
  }).join('\n');

  return `
  <svg width="400" height="220" xmlns="http://www.w3.org/2000/svg" class="container">
    <style>
      .bg { fill: ${theme.background}; }
      .card-bg { fill: ${theme.cardBackground}; stroke: ${theme.stroke}; }
      .header { font: bold 18px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.header}; }
    </style>
    <rect width="100%" height="100%" rx="8" ry="8" class="bg"/>
    <rect x="5" y="5" width="390" height="210" rx="8" ry="8" class="card-bg"/>
    <text x="20" y="32" class="header">Contribution Stats</text>
    ${rows}
  </svg>`;
}

module.exports = {
  createContributionStatsCard,
};
