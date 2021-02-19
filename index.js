const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    const repoName = context.repo.repo;
    const repoOwner = context.repo.owner;
    const repoToken = core.getInput('repo-token');
    const testCommand = 'npx jest --coverage --coverageReporters="json-summary"';
    const octokit = github.getOctokit(repoToken);

    const commitPRs = await octokit.repos.listPullRequestsAssociatedWithCommit(
        {
          repo: repoName,
          owner: repoOwner,
          commit_sha: context.sha,
        },
    );

    const prNumber = commitPRs.data[0].number;
    console.log(prNumber);

    execSync(testCommand).toString();
    const coverageData = fs.readFileSync('./coverage/coverage-summary.json');
    // coveragePercentage = parseFloat(coveragePercentage).toFixed(2);
    console.log(coverageData);

    /* const commentBody = `<p>Total Coverage: <code>${coveragePercentage}</code></p>
    <details><summary>Coverage report</summary>
    <p>
    <pre>${codeCoverage}</pre>
    </p>
    </details>`;

  await octokit.issues.createComment({
    repo: repoName,
    owner: repoOwner,
    body: commentBody,
    issue_number: prNumber,
  });
*/
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
