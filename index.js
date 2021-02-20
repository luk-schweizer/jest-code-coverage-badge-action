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
    return JSON.parse(data);
    // coveragePercentage = parseFloat(coveragePercentage).toFixed(2);
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
      console.log('badge not found');
    }

      const response = await fetch(url);
      const badgeContent = await response.buffer();
      const badgeContentBase64 = badgeContent.toString('base64');

        await octokit.repos.createOrUpdateFileContents(
            {
                owner: repoOwner,
                repo: repoName,
                path: '.coverage/badge.svg',
                message: `Code Coverage Badge for Run number ${github.run_id}-${github.run_number}`,
                content: badgeContentBase64,
                branch: ref,
                sha: sha
            }
          );
        console.log('NO updating');
}