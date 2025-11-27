const https = require('https');

function postGraphQL(query, variables = {}) {
  const token = process.env.GH_TOKEN;
  if (!token) {
    console.warn('GH_TOKEN is required for GraphQL requests. Returning null instead.');
    return Promise.resolve(null);
  }

  const payload = JSON.stringify({ query, variables });

  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'api.github.com',
        path: '/graphql',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'User-Agent': 'GitHub-Profile-Stats',
          Authorization: `bearer ${token}`,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            if (json.errors) {
              console.warn('GraphQL responded with errors:', json.errors.map((e) => e.message).join(', '));
              resolve(null);
              return;
            }
            resolve(json.data);
          } catch (error) {
            console.error('Failed to parse GraphQL response:', error.message);
            resolve(null);
          }
        });
      }
    );

    req.on('error', (error) => {
      console.error('GraphQL request error:', error.message);
      resolve(null);
    });
    req.write(payload);
    req.end();
  });
}

module.exports = { postGraphQL };
