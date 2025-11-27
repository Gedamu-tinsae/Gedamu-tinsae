const { fetchUserRepos, fetchRepoLanguages } = require('./githubApi');

async function getUserLanguages(username) {
  try {
    const repos = await fetchUserRepos(username);
    if (!Array.isArray(repos)) {
      return [];
    }

    const languages = {};

    for (const repo of repos) {
      if (!repo.languages_url) continue;

      try {
        const languageBreakdown = await fetchRepoLanguages(repo.languages_url);
        for (const [language, bytes] of Object.entries(languageBreakdown)) {
          languages[language] = (languages[language] || 0) + bytes;
        }
      } catch (error) {
        // Skip problematic repos but continue aggregating.
        continue;
      }
    }

    const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

    return Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(2) : 0,
      }))
      .filter((lang) => lang.bytes > 0)
      .sort((a, b) => b.bytes - a.bytes);
  } catch (error) {
    console.error('Error fetching languages:', error.message);
    return [];
  }
}

module.exports = {
  getUserLanguages,
};
