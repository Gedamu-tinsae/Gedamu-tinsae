const { fetchUserRepos, fetchRepoCommits } = require('./githubApi');

const DEFAULT_REPO_LIMIT = 5;
const DEFAULT_COMMITS_PER_REPO = 50;

function normalizeHour(hour, offset) {
  return (hour + offset + 24) % 24;
}

async function getCommitActivityStats(username, options = {}) {
  const repoLimit = options.repoLimit ?? DEFAULT_REPO_LIMIT;
  const commitsPerRepo = options.commitsPerRepo ?? DEFAULT_COMMITS_PER_REPO;
  const timezoneOffset = options.timezoneOffset ?? Number(process.env.PRODUCTIVE_TIME_OFFSET || 0);

  const repos = await fetchUserRepos(username);
  if (!Array.isArray(repos)) {
    return Array(24).fill(0);
  }

  const hourBuckets = Array(24).fill(0);

  for (const repo of repos.slice(0, repoLimit)) {
    const owner = repo.owner?.login;
    const repoName = repo.name;
    if (!owner || !repoName) {
      continue;
    }

    const commits = await fetchRepoCommits(owner, repoName, commitsPerRepo);
    if (!Array.isArray(commits)) {
      continue;
    }

    for (const commit of commits) {
      const authored = commit.commit?.author?.date;
      if (!authored) continue;

      const date = new Date(authored);
      if (Number.isNaN(date.getTime())) continue;

      const adjustedHour = normalizeHour(date.getUTCHours(), timezoneOffset);
      hourBuckets[adjustedHour] += 1;
    }
  }

  return hourBuckets;
}

module.exports = {
  getCommitActivityStats,
};
