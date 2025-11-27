const fs = require('fs');
const path = require('path');

const { fetchGitHubUserData } = require('./lib/githubApi');
const { getUserLanguages } = require('./lib/languageStats');
const { getCommitLanguageStats } = require('./lib/commitLanguageStats');
const { getCommitActivityStats } = require('./lib/commitActivityStats');
const { getContributionStats } = require('./lib/contributionStats');
const { createProfileDetailsCard } = require('./lib/cards/profileCard');
const { createReposPerLanguageCard } = require('./lib/cards/languageCard');
const { createMostCommitLanguageCard } = require('./lib/cards/commitLanguageCard');
const { createStatsCard } = require('./lib/cards/statsCard');
const { createProductiveTimeCard } = require('./lib/cards/productiveTimeCard');
const { createContributionStatsCard } = require('./lib/cards/contributionStatsCard');
const { createActivityInsightsCard } = require('./lib/cards/activityInsightsCard');

const OUTPUT_DIR = path.resolve(__dirname, '../assets');
const USERNAME = process.env.GITHUB_USERNAME || 'Gedamu-tinsae';

async function ensureOutputDir() {
  await fs.promises.mkdir(OUTPUT_DIR, { recursive: true });
}

function writeCard(filename, content) {
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, content);
  return filePath;
}

async function generateCards() {
  const userData = await fetchGitHubUserData(USERNAME);
  const languages = await getUserLanguages(USERNAME);
  const commitLanguages = await getCommitLanguageStats(USERNAME);
  const activityStats = await getCommitActivityStats(USERNAME);
  const contributionStats = await getContributionStats(USERNAME);

  return [
    writeCard('0-profile-details.svg', createProfileDetailsCard(userData)),
    writeCard('1-repos-per-language.svg', createReposPerLanguageCard(languages)),
    writeCard('2-most-commit-language.svg', createMostCommitLanguageCard(commitLanguages)),
    writeCard('3-stats.svg', createStatsCard(userData)),
    writeCard('4-productive-time.svg', createProductiveTimeCard(activityStats)),
    writeCard('5-contribution-stats.svg', createContributionStatsCard(contributionStats)),
    writeCard('6-activity-insights.svg', createActivityInsightsCard(contributionStats)),
  ];
}

async function main() {
  try {
    await ensureOutputDir();
    await generateCards();
    console.log('All GitHub stats cards generated successfully in assets directory!');
  } catch (error) {
    console.error('Error generating stats:', error.message);
    process.exit(1);
  }
}

main();
