async function fetchGitHubData(username) {
    const headers = {
        'Accept': 'application/vnd.github.v3+json'
    };

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
    const repos = await reposResponse.json();

    if (!reposResponse.ok) {
        throw new Error(`GitHub API error: ${reposResponse.statusText}`);
    }

    const languageData = {};
    let totalStars = 0;
    let totalContributions = 0;

    for (const repo of repos) {
        totalStars += repo.stargazers_count;

        const langResponse = await fetch(repo.languages_url, { headers });
        const languages = await langResponse.json();

        if (!langResponse.ok) {
            throw new Error(`GitHub API error: ${langResponse.statusText}`);
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

    return { languageData, totalStars, totalContributions, totalRepos: repos.length };
}

function calculateLanguagePercentages(languageData) {
    const totalBytes = Object.values(languageData).reduce((acc, bytes) => acc + bytes, 0);
    const languagePercentages = {};

    for (const [language, bytes] of Object.entries(languageData)) {
        languagePercentages[language] = ((bytes / totalBytes) * 100).toFixed(2);
    }

    return languagePercentages;
}

async function updateGitHubInfo(username) {
    try {
        const { languageData, totalStars, totalContributions, totalRepos } = await fetchGitHubData(username);

        document.getElementById('loadtext').innerText = ""
        document.getElementById('total-repos').innerText = totalRepos;
        document.getElementById('total-stars').innerText = totalStars;
        document.getElementById('total-contributions').innerText = totalContributions;

        const languagePercentages = calculateLanguagePercentages(languageData);
        drawPieChart(languagePercentages);
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
    }
}

function drawPieChart(languagePercentages) {
    const ctx = document.getElementById('languageChart').getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(languagePercentages),
            datasets: [{
                data: Object.values(languagePercentages),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Languages Used in GitHub Projects'
                }
            }
        }
    });
}

updateGitHubInfo('sajid1495');