const fetch = require('node-fetch');

exports.handler = async (event) => {
  const username = 'sajid1495'; // replace with your GitHub username
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json'
  };

  try {
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    const repos = await reposResponse.json();

    if (!reposResponse.ok) {
      return {
        statusCode: reposResponse.status,
        body: JSON.stringify({ error: repos.message })
      };
    }

    const languageData = {};
    let totalStars = 0;
    let totalContributions = 0;

    for (const repo of repos) {
      totalStars += repo.stargazers_count;

      const langResponse = await fetch(repo.languages_url, { headers });
      const languages = await langResponse.json();

      if (!langResponse.ok) {
        return {
          statusCode: langResponse.status,
          body: JSON.stringify({ error: langResponse.message })
        };
      }

      for (const [language, bytes] of Object.entries(languages)) {
        if (languageData[language]) {
          languageData[language] += bytes;
        } else {
          languageData[language] = bytes;
        }
      }

      const eventsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/events`, { headers });
      const events = await eventsResponse.json();

      if (eventsResponse.ok) {
        totalContributions += events.filter(event => event.type === 'PushEvent').length;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ languageData, totalStars, totalContributions, totalRepos: repos.length })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
