const {Octokit} = require('@octokit/rest');

test('code-coverage-jest-action should create a commit with a message having the run info when it is manually run', async () => {
  const octokit = new Octokit({auth: process.env.GITHUB_TOKEN});
  const githubRepoSplitted = process.env.GITHUB_REPOSITORY.split('/');
  const owner = githubRepoSplitted[0];
  const repository = githubRepoSplitted[1];
  const startTime = new Date();
  const TIMEOUT_IN_SECONDS = 60;

  const branchRef = `refs/heads/integration-branch-${startTime.getTime()}`;

  // get sha from ref: REPOSITORY_REF
  const refData = await octokit.git.getRef({
    owner: owner,
    repo: repository,
    ref: 'heads/dev',
  });
  // process.env.REPOSITORY_REF

  await octokit.git.createRef({
    owner: owner,
    repo: repository,
    ref: branchRef,
    sha: refData.data.object.sha,
  });

  // actions:read //actions:write
  const resultWorkflow = await octokit.actions.createWorkflowDispatch({
    owner: owner,
    repo: repository,
    workflow_id: process.env.WORKFLOW_ID_FOR_TEST,
    ref: branchRef,
  });
  console.log(resultWorkflow);

  // get run id.
  const runs = await octokit.actions.listWorkflowRuns({
    owner: owner,
    repo: repository,
    workflow_id: process.env.WORKFLOW_ID_FOR_TEST,
    per_page: 1,
    page: 1,
  });

  console.log(runs.data.workflow_runs[0]);
  const runNumber = runs.data.workflow_runs[0].run_number;
  const runId = runs.data.workflow_runs[0].id;
  const status = runs.data.workflow_runs[0].status;
  const conclusion = runs.data.workflow_runs[0].conclusion;
  console.log(runNumber, runId, status, conclusion);
  console.log(runs.data.workflow_runs[0].updated_at > startTime.toISOString())
  // 2 608730573 completed success
  // get first and runId.
  /* octokit.actions.getWorkflowRun({
  owner,
  repo,
  run_id,
});*/

  // wait for finish
  // "status": "queued",
  // "conclusion": null,
  // "run_number": 562,

  // asset conclusion.ok
  // chequeo que haya un commit en los ultimos 5 minutos, en el path de test integrtion
  // `Code Coverage Badge for Run job-runId-runNumber`
  const commits = await octokit.repos.listCommits({
    owner: owner,
    repo: repository,
    path: 'tests/integration/badge.svg',
    since: startTime.toISOString(),
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
