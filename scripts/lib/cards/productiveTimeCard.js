const { getTheme } = require('../theme');

function formatHour(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}${suffix}`;
}

function createProductiveTimeCard(hourlyStats = []) {
  const theme = getTheme();
  const hours = hourlyStats.length === 24 ? hourlyStats : Array(24).fill(0);
  const maxValue = Math.max(...hours, 1);
  const hasData = hours.some((value) => value > 0);

  const barBaseline = 135;
  const bars = hours
    .map((value, hour) => {
      const height = hasData ? Math.max(4, (value / maxValue) * 80) : 4;
      const x = 20 + hour * 14;
      const label = formatHour(hour);
      return `
        <g transform="translate(${x}, 0)">
          <rect x="0" y="${barBaseline - height}" width="10" height="${height}" fill="${theme.accent}" opacity="${hasData ? 0.85 : 0.3}">
            <title>${label}: ${value} commits</title>
          </rect>
          ${hour % 4 === 0 ? `<text x="5" y="${barBaseline + 18}" font-size="8" text-anchor="middle" fill="${theme.muted}">${label}</text>` : ''}
        </g>`;
    })
    .join('\n');

  const topHours = hours
    .map((value, hour) => ({ hour, value }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((entry, index) => `<tspan x="20" dy="${index === 0 ? 0 : 14}">• ${formatHour(entry.hour)} — ${entry.value} commits</tspan>`)
    .join('');

  const summary = hasData
    ? `<text x="20" y="175" class="stat">${topHours || 'Consistent activity across all hours.'}</text>`
    : `<text x="20" y="115" class="stat">Not enough recent activity to build a timeline.</text>`;

  return `
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" class="container">
    <style>
      .bg { fill: ${theme.background}; }
      .card-bg { fill: ${theme.cardBackground}; stroke: ${theme.stroke}; }
      .header { font: bold 16px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.header}; }
      .stat { font: 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.muted}; }
    </style>
    <rect width="100%" height="100%" rx="8" ry="8" class="bg"/>
    <rect x="5" y="5" width="390" height="190" rx="8" ry="8" class="card-bg"/>
    <text x="20" y="32" class="header">Productive Time</text>
    <text x="20" y="50" class="stat">Recent commits grouped by hour (local offset applied).</text>
    <g transform="translate(0, 0)">
      ${bars}
    </g>
    ${summary}
  </svg>`;
}

module.exports = {
  createProductiveTimeCard,
};
