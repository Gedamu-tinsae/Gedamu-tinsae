const { fetchUserRepos, fetchRepoCommits, fetchCommitDetails } = require('./githubApi');
const { detectLanguage } = require('./languageMap');

const DEFAULT_REPO_LIMIT = 5;
const DEFAULT_COMMITS_PER_REPO = 20;

async function getCommitLanguageStats(username, options = {}) {
  const repoLimit = options.repoLimit || DEFAULT_REPO_LIMIT;
  const commitsPerRepo = options.commitsPerRepo || DEFAULT_COMMITS_PER_REPO;
  const repos = await fetchUserRepos(username);
  if (!Array.isArray(repos)) {
    return [];
  }

  const languageCounts = {};

  for (const repo of repos.slice(0, repoLimit)) {
    const owner = repo.owner?.login;
    const repoName = repo.name;
    if (!owner || !repoName) continue;

    const commits = await fetchRepoCommits(owner, repoName, commitsPerRepo);
    if (!Array.isArray(commits)) continue;

    for (const commit of commits) {
      if (!commit.sha) continue;

      const commitDetails = await fetchCommitDetails(owner, repoName, commit.sha);
      if (!commitDetails || !Array.isArray(commitDetails.files)) continue;

      for (const file of commitDetails.files) {
        const language = detectLanguage(file.filename);
        if (!language) continue;

        const weight = file.changes || file.additions || 1;
        languageCounts[language] = (languageCounts[language] || 0) + weight;
      }
    }
  }

  return Object.entries(languageCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

module.exports = {
  getCommitLanguageStats,
};
