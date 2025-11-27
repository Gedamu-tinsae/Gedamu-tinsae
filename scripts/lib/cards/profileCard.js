const { getTheme } = require('../theme');

function createProfileDetailsCard(user) {
  const theme = getTheme();
  return `
  <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg" class="container">
    <style>
      .bg { fill: ${theme.background}; }
      .card-bg { fill: ${theme.cardBackground}; stroke: ${theme.stroke}; }
      .header { font: bold 20px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.header}; }
      .subtitle { font: 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.muted}; }
      .stat { font: 13px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.muted}; }
      .value { font: bold 14px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${theme.value}; }
      .icon-circle { fill: #238636; }
    </style>
    <rect width="100%" height="100%" rx="10" ry="10" class="bg"/>
    <rect x="5" y="5" width="390" height="190" rx="10" ry="10" class="card-bg"/>

    <g transform="translate(20, 30)">
      <circle cx="0" cy="0" r="12" class="icon-circle"/>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="#f0f6fc"/>
    </g>

    <text x="50" y="35" class="header">${user.name || user.login}</text>
    <text x="50" y="55" class="subtitle">@${user.login}</text>

    <g transform="translate(20, 90)">
      <g transform="translate(0, 0)">
        <circle cx="0" cy="5" r="3" fill="#79c0ff"/>
        <text x="10" y="10" class="stat">Joined: <tspan class="value">${user.created_at?.substring(0, 10) || 'N/A'}</tspan></text>
      </g>
      <g transform="translate(0, 20)">
        <circle cx="0" cy="5" r="3" fill="#f85149"/>
        <text x="10" y="10" class="stat">Location: <tspan class="value">${user.location || 'N/A'}</tspan></text>
      </g>
      <g transform="translate(0, 40)">
        <circle cx="0" cy="5" r="3" fill="#3fb950"/>
        <text x="10" y="10" class="stat">Company: <tspan class="value">${user.company || 'N/A'}</tspan></text>
      </g>
    </g>

    <g transform="translate(220, 90)">
      <g transform="translate(0, 0)">
        <text x="0" y="0" class="stat">Repos</text>
        <text x="0" y="15" class="value">${user.public_repos}</text>
      </g>
      <g transform="translate(55, 0)">
        <text x="0" y="0" class="stat">Gists</text>
        <text x="0" y="15" class="value">${user.public_gists}</text>
      </g>
      <g transform="translate(110, 0)">
        <text x="0" y="0" class="stat">Followers</text>
        <text x="0" y="15" class="value">${user.followers}</text>
      </g>
    </g>
  </svg>`;
}

module.exports = {
  createProfileDetailsCard,
};
