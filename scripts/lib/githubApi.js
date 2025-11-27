const https = require('https');

const DEFAULT_HEADERS = {
  'User-Agent': 'GitHub-Profile-Stats',
  'Accept': 'application/vnd.github.v3+json',
};

function withAuthHeaders(headers = {}) {
  const token = process.env.GH_TOKEN;
  return {
    ...DEFAULT_HEADERS,
    ...headers,
    ...(token ? { Authorization: `token ${token}` } : {}),
  };
}

function requestJson(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        method: 'GET',
        ...options,
        headers: withAuthHeaders(options.headers),
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function fetchGitHubUserData(username) {
  return requestJson({
    hostname: 'api.github.com',
    path: `/users/${username}`,
  });
}

async function fetchUserRepos(username) {
  return requestJson({
    hostname: 'api.github.com',
    path: `/users/${username}/repos?sort=updated&direction=desc&per_page=100`,
  });
}

async function fetchRepoCommits(owner, repo, perPage = 30) {
  return requestJson({
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/commits?per_page=${perPage}`,
  }).catch((error) => {
    console.error(`Error fetching commits for ${owner}/${repo}:`, error.message);
    return [];
  });
}

async function fetchCommitDetails(owner, repo, sha) {
  return requestJson({
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/commits/${sha}`,
  }).catch((error) => {
    console.error(`Error fetching commit ${sha} for ${owner}/${repo}:`, error.message);
    return null;
  });
}

async function fetchRepoLanguages(languagesUrl) {
  const parsed = new URL(languagesUrl);
  return requestJson({
    hostname: parsed.hostname,
    path: parsed.pathname,
  }).catch((error) => {
    console.error('Error fetching repo languages:', error.message);
    return {};
  });
}

module.exports = {
  fetchGitHubUserData,
  fetchUserRepos,
  fetchRepoCommits,
  fetchCommitDetails,
  fetchRepoLanguages,
};
