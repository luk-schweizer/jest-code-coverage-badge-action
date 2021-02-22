const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs');
const fetch = require('node-fetch');

async function run() {
  const badgeFilePath = core.getInput('create-file-path');
  const testCommand = 'npx jest --coverage --coverageReporters="json-summary"';

  await exec.exec(testCommand);
  const coverageData = getCoverageData();
  const badgeUrl = generateBadgeUrl(coverageData);
  if (badgeFilePath) {
    await createOrUpdateBadgeFile(badgeFilePath, badgeUrl, coverageData);
  }
  core.setOutput("BADGE_URL", badgeUrl);
}

run().catch((err) => core.setFailed(err.message));

const getCoverageData = () => {
    const data = fs.readFileSync('./coverage/coverage-summary.json');
    const jsonData = JSON.parse(data);
    return data.total.lines.pct;
}

const generateBadgeUrl = (coverageData) => {
    const url = 'https://img.shields.io/badge/coverage-90-green';
    return url;
}

const createOrUpdateBadgeFile = async (badgeFilePath, badgeUrl, coverageData) => {
  const context = github.context;
  const repoName = context.repo.repo;
  const ref = context.ref;
  const repoOwner = context.repo.owner;
  const repoToken = core.getInput('repo-token');
  const octokit = github.getOctokit(repoToken);

  console.log(context);

  const existingBadge = null;
  const sha = null;
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
                          message: `Code Coverage Badge for Run number ${context.run_id}-${context.run_number}`,
                          content: badgeContentBase64,
                          branch: ref,
                                                }
       if (sha) payload.sha = sha;

        await octokit.repos.createOrUpdateFileContents(payload);
}