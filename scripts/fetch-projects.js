const { Octokit } = require("@octokit/rest");
const fs = require('fs');
const path = require('path');

async function fetchProjectNames() {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const username = process.env.GITHUB_REPOSITORY_OWNER;

    if (!username) {
      throw new Error("GITHUB_REPOSITORY_OWNER environment variable is not set.");
    }

    console.log(`Fetching public repositories for user: ${username}`);
    const { data: repos } = await octokit.repos.listForUser({
      username: username,
      type: 'owner', // 'all', 'owner', 'member'
      sort: 'updated',
      per_page: 100, // Adjust if user has more repos
    });

    const publicRepoNames = repos
      .filter(repo => !repo.private)
      .map(repo => repo.name);

    console.log(`Found ${publicRepoNames.length} public repositories.`);
    
    // Define the output path within the workspace
    const outputPath = path.join(process.env.GITHUB_WORKSPACE, 'project-names.json');
    fs.writeFileSync(outputPath, JSON.stringify(publicRepoNames, null, 2));
    console.log(`Project names saved to ${outputPath}`);

  } catch (error) {
    console.error("Error fetching project names:", error.message);
    if (error.status) {
      console.error(`GitHub API Error Status: ${error.status}`);
      console.error(error.response.data);
    }
    process.exit(1);
  }
}

fetchProjectNames();
