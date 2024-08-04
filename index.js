document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    window.location.href = targetId;
    window.location.reload();
  });
});


var typed = new Typed(".text", {
  strings: ["CS Undergrad Student of RUET", "Competitive Programmer", "Flutter App Developer", "Frontend Web Developer"],
  typeSpeed: 100,
  backSpeed: 10,
  backDelay: 100,
  loop: true,
});


let textEl = document.getElementById("jstext")

const text = `
I was born on 22 September 2002. 
Currently, I'm living in Rajshahi, Bangladesh.
My childhood was spent in a village.
I'm a foodie and my favorite food is "Kacci Biriyani", a beef item with rice.
My hobbies are cooking, listening to music, and reading adventurous stories.
I hope that's enough to know me.😊
`

function showText() {
  textEl.innerHTML = text
}

function hideText() {
  textEl.innerHTML = ""
}


const form = document.getElementById('myForm');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(form);
  fetch('https://script.google.com/macros/s/AKfycbwc3niEvLO1Jua5jw7xdVGh1c_AgGk1lsQDU0NRw8NcW-WBny468T4JoHfgmKLa9NfC/exec', {
    method: 'POST',
    body: data
  })
    .then(response => response.text())
    .then(result => {
      alert('Form Submitted: ' + result);
      form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
    });
});





const GITHUB_TOKEN = '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';

async function fetchGitHubData(username) {
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
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

// Replace 'your-github-username' with your actual GitHub username
updateGitHubInfo('sajid1495');
