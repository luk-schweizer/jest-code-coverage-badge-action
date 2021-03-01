const {Octokit} = require('@octokit/rest');
const axios = require('axios');

test('code-coverage-jest-action should create a commit with a message having the run info when it is manually run', async () => {
  const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});
  const githubRepoSplitted = process.env.GITHUB_REPOSITORY.split('/');
  const owner = githubRepoSplitted[0];
  const repository = githubRepoSplitted[1];

  // 2 608730573 completed success
  // `Code Coverage Badge for Run job-runId-runNumber`
  const commits = await octokit.repos.listCommits({
    owner: owner,
    repo: repository,
    path: 'tests/integration/badge.svg',
    sha: process.env.GITHUB_INTEGRATION_BRANCH,
 });

  console.log(commits);

  // expect(octokit.repos.getContent).toHaveBeenCalledTimes(1);
  // expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledTimes(1);
  // expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledWith(expectedPayload);

  // delete created branch
  /* await octokit.git.deleteRef({
      owner: owner,
      repo: repository,
      ref: branchRef,
    });*/
});
