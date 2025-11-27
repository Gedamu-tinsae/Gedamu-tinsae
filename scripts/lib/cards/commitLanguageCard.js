const { getTheme } = require('../theme');

function createMostCommitLanguageCard(stats = []) {
  const theme = getTheme();
  const topLanguages = stats.slice(0, 4);
  const hasData = topLanguages.length > 0;
  const maxValue = hasData ? topLanguages[0].value || 1 : 1;
  const colors = ['#79c0ff', '#f85149', '#3fb950', '#d29922'];

  const bars = hasData
    ? topLanguages
        .map((lang, index) => {
          const width = Math.max(30, (lang.value / maxValue) * 250);
          return `
        <g transform="translate(20, ${60 + index * 30})">
          <rect x="0" y="0" width="${width}" height="16" fill="${colors[index % colors.length]}" rx="4" />
          <text x="${width + 10}" y="12" font-family="Segoe UI" font-size="12" fill="${theme.muted}">${lang.name} (${lang.value})</text>
        </g>`;
        })
        .join('\n')
    : `
      <text x="20" y="80" font-family="Segoe UI" font-size="14" fill="${theme.muted}">
        Not enough commit data to determine languages yet.
      </text>`;

  return `
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" class="container">
    <style>
      .bg { fill: ${theme.background}; }
      .card-bg { fill: ${theme.cardBackground}; stroke: ${theme.stroke}; }
      .header { font: bold 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.header}; }
      .stat { font: 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.muted}; }
    </style>
    <rect width="100%" height="100%" rx="8" ry="8" class="bg"/>
    <rect x="5" y="5" width="390" height="190" rx="8" ry="8" class="card-bg"/>
    <text x="20" y="32" class="header">Commit Language Distribution</text>
    <text x="20" y="52" class="stat">Based on recent commits from active repositories.</text>
    ${bars}
  </svg>`;
}

module.exports = {
  createMostCommitLanguageCard,
};
