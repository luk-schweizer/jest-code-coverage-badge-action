const core = require('@actions/core');
const {github, context} = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
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

  await exec.exec(testCommand);
  const coverageData = fs.readFileSync('./coverage/coverage-summary.json');
  // coveragePercentage = parseFloat(coveragePercentage).toFixed(2);
  console.log(JSON.parse(coverageData));

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
}
run().catch((err) => core.setFailed(err.message));
