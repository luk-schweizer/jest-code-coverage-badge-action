const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs');
const fetch = require('node-fetch');

async function run() {
  const badgeFilePath = core.getInput('create-file-path');
  const testCommand = 'npx jest --coverage --coverageReporters="json-summary"';

  await exec.exec(testCommand);
  const coverage = getCoverage();
  const badgeUrl = generateBadgeUrl(coverage);
  if (badgeFilePath) {
    await createOrUpdateBadgeFile(badgeFilePath, badgeUrl);
  }
  core.setOutput("BADGE_URL", badgeUrl);
}

run().catch((err) => core.setFailed(err.message));

const getCoverage = () => {
    const data = fs.readFileSync('./coverage/coverage-summary.json');
    const jsonData = JSON.parse(data);
    return jsonData.total.lines.pct;
}

const generateBadgeUrl = (coverage) => {
    const colorConfiguration = core.getInput('badge-color-configuration');
    console.log(JSON.parse(colorConfiguration));
    const label = core.getInput('badge-label');
    const availableColors = ['brightgreen', 'green', 'yellowgreen', 'yellow', 'orange', 'red'];
    const color = 'green';
    return `https://img.shields.io/badge/${label}-${coverage}%25-${color}`;
}

const createOrUpdateBadgeFile = async (badgeFilePath, badgeUrl) => {
  const context = github.context;
  const repoName = context.repo.repo;
  const ref = context.ref;
  const repoOwner = context.repo.owner;
  const repoToken = core.getInput('repo-token');
  const octokit = github.getOctokit(repoToken);

  let existingBadge = null;
  let sha = null;
    try{
      existingBadge = await octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: badgeFilePath,
        ref: ref
      });

      console.log(existingBadge);
      sha = existingBadge.data.sha;
    } catch (e) {
      console.log('badge not found', e);
    }

      const response = await fetch(badgeUrl);
      const badgeContent = await response.buffer();
      const badgeContentBase64 = badgeContent.toString('base64');
        let payload = {
                          owner: repoOwner,
                          repo: repoName,
                          path: badgeFilePath,
                          message: `Code Coverage Badge for Run ${context.job}-${context.runId}-${context.runNumber}`,
                          content: badgeContentBase64,
                          branch: ref,
                                                }
       if (sha) payload.sha = sha;

        await octokit.repos.createOrUpdateFileContents(payload);
}