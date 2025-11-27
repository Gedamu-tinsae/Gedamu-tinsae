const { postGraphQL } = require('./githubGraphql');
const { fetchUserRepos } = require('./githubApi');

const CONTRIBUTION_QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
      totalCommitContributions
    }
    pullRequests {
      totalCount
    }
    issues {
      totalCount
    }
    repositoriesContributedTo(contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
      totalCount
    }
    repositories(orderBy: {field: PUSHED_AT, direction: DESC}, first: 1) {
      nodes {
        nameWithOwner
        pushedAt
        url
      }
    }
  }
}`;

async function sumUserStars(username) {
  try {
    const repos = await fetchUserRepos(username);
    if (!Array.isArray(repos)) {
      return 0;
    }
    return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  } catch (error) {
    console.error('Error summing stars:', error.message);
    return 0;
  }
}

function flattenContributionDays(calendar) {
  if (!calendar?.weeks) return [];
  const days = [];
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      if (day?.date) {
        days.push({
          date: day.date,
          contributionCount: day.contributionCount || 0,
        });
      }
    }
  }
  return days.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function calculateStreaks(days) {
  if (days.length === 0) {
    return { currentStreak: 'N/A', longestStreak: 'N/A', lastContributionDate: 'N/A' };
  }

  let longest = 0;
  let current = 0;
  let previousDate = null;
  for (const day of days) {
    const date = new Date(day.date);
    if (day.contributionCount > 0) {
      if (previousDate && (date - previousDate) / 86400000 === 1) {
        current += 1;
      } else {
        current = 1;
      }
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
    previousDate = date;
  }

  let currentStreak = 0;
  let lastDate = null;
  const descending = [...days].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const day of descending) {
    const date = new Date(day.date);
    if (day.contributionCount === 0) {
      if (currentStreak === 0) {
        lastDate = date;
        continue;
      }
      break;
    }
    if (currentStreak === 0) {
      currentStreak = 1;
      lastDate = date;
      continue;
    }
    const diff = Math.round((lastDate - date) / 86400000);
    if (diff === 1) {
      currentStreak += 1;
      lastDate = date;
    } else {
      break;
    }
  }

  const lastContributionDay = descending.find((day) => day.contributionCount > 0);
  const formattedLastContribution = lastContributionDay ? lastContributionDay.date : 'N/A';

  return {
    currentStreak: currentStreak || 'N/A',
    longestStreak: longest || 'N/A',
    lastContributionDate: formattedLastContribution,
  };
}

async function getContributionStats(username) {
  const [graphData, totalStars] = await Promise.all([
    postGraphQL(CONTRIBUTION_QUERY, { login: username }),
    sumUserStars(username),
  ]);

  if (!graphData || !graphData?.user) {
    return {
      totalStars,
      totalCommits: 'N/A',
      totalContributions: 'N/A',
      totalPullRequests: 'N/A',
      totalIssues: 'N/A',
      contributedRepos: 'N/A',
      currentStreak: 'N/A',
      longestStreak: 'N/A',
      lastContributionDate: 'N/A',
      lastActiveRepo: 'N/A',
      lastActiveRepoUrl: '',
      lastActiveRepoPushedAt: 'N/A',
    };
  }

  const user = graphData.user;
  const safeNumber = (value) => (typeof value === 'number' ? value : 'N/A');
  const calendar = user.contributionsCollection?.contributionCalendar;
  const days = flattenContributionDays(calendar);
  const { currentStreak, longestStreak, lastContributionDate } = calculateStreaks(days);
  const lastRepo = user.repositories?.nodes?.[0];

  return {
    totalStars,
    totalCommits: safeNumber(user.contributionsCollection?.totalCommitContributions),
    totalContributions: safeNumber(calendar?.totalContributions),
    totalPullRequests: safeNumber(user.pullRequests?.totalCount),
    totalIssues: safeNumber(user.issues?.totalCount),
    contributedRepos: safeNumber(user.repositoriesContributedTo?.totalCount),
    currentStreak,
    longestStreak,
    lastContributionDate,
    lastActiveRepo: lastRepo?.nameWithOwner || 'N/A',
    lastActiveRepoUrl: lastRepo?.url || '',
    lastActiveRepoPushedAt: lastRepo?.pushedAt || 'N/A',
  };
}

module.exports = {
  getContributionStats,
};
