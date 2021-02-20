const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs');
const fetch = require('node-fetch');

async function run() {
  const context = github.context;
  const repoName = context.repo.repo;
  const ref = context.ref;
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

  //const prNumber = commitPRs.data[0].number;
  //console.log(prNumber);

  const existingBadge = await octokit.repos.getContent({
    owner: repoOwner,
    repo: repoName,
    path: '.coverage/badge.svg',
    ref: ref
  });
   console.log(existingBadge);
  const sha = existingBadge.sha;
  const url = 'https://img.shields.io/badge/coverage-90-green';
  const response = await fetch(url);
  const badgeContent = await response.buffer();

  await octokit.repos.createOrUpdateFileContents(
    {
        owner: repoOwner,
        repo: repoName,
        path: '.coverage/badge.svg',
        message: `Code Coverage Badge for Build number `,
        content: badgeContent.toString('base64'),
        branch: ref,
        sha: sha
    }
  );

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
