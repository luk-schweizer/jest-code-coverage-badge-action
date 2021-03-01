const {Octokit} = require('@octokit/rest');

test('code-coverage-jest-action should create a commit with a message having the run info when it is manually run', async () => {
  const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});
  const githubRepoSplit = process.env.GITHUB_REPOSITORY.split('/');
  const owner = githubRepoSplit[0];
  const repository = githubRepoSplit[1];

  const commits = await octokit.repos.listCommits({
    owner: owner,
    repo: repository,
    path: process.env.BADGE_PATH,
    sha: process.env.GITHUB_INTEGRATION_BRANCH,
  });
  expect(commits.data).not.toBe(null);
  expect(commits.data.length).toBe(1);
  const expectedMessage = `Code Coverage Badge for Run
    ${process.env.JOB_NAME}-${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_NUMBER}`;
  expect(commits.data[0].commit.message).toBe(expectedMessage);
});
