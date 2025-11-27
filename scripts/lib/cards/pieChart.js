function createPieChart(languages, colorResolver) {
  const topLanguages = languages.slice(0, 6);
  const centerX = 175;
  const centerY = 105;
  const radius = 55;

  if (topLanguages.length === 0) {
    return `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="#30363d" stroke="#444d56" stroke-width="2"/>`;
  }

  let cumulativePercentage = 0;
  let paths = '';
  for (let i = 0; i < topLanguages.length; i++) {
    const lang = topLanguages[i];
    const percentage = parseFloat(lang.percentage);
    const sliceDegrees = percentage * 3.6;
    if (percentage === 0) continue;

    const startAngle = cumulativePercentage * 3.6;
    const endAngle = (cumulativePercentage + percentage) * 3.6;

    const startX = centerX + radius * Math.cos(((startAngle - 90) * Math.PI) / 180);
    const startY = centerY + radius * Math.sin(((startAngle - 90) * Math.PI) / 180);
    const endX = centerX + radius * Math.cos(((endAngle - 90) * Math.PI) / 180);
    const endY = centerY + radius * Math.sin(((endAngle - 90) * Math.PI) / 180);

    const largeArcFlag = sliceDegrees > 180 ? 1 : 0;
    const color = colorResolver ? colorResolver(lang.name, i) : undefined;

    paths += `
      <path d="M ${centerX},${centerY} L ${startX},${startY} A ${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z"
            fill="${color || '#79c0ff'}" opacity="0.9" />
    `;

    cumulativePercentage += percentage;
  }

  return paths;
}

module.exports = {
  createPieChart,
};
