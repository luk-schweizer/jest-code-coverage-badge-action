const github = require('@actions/github');
const core = require('@actions/core');
const fetch = require('node-fetch');

module.exports.createOrUpdate = async (badgeFilePath, badgeUrl) => {
  const context = github.context;
  const repoName = context.repo.repo;
  const ref = context.ref;
  const repoOwner = context.repo.owner;
  const repoToken = core.getInput('repo-token');
  const octokit = github.getOctokit(repoToken);

  const sha = await getExistingShaBadgeFile(octokit, repoOwner, repoName, badgeFilePath, ref);
  const badgeContentInBase64 = await getBadgeContentInBase64FromUrl(badgeUrl);

  const payload = {
    owner: repoOwner,
    repo: repoName,
    path: badgeFilePath,
    message: 'Code Coverage Badge',
    content: badgeContentInBase64,
    branch: ref,
  };
  if (sha) payload.sha = sha;

  await octokit.repos.createOrUpdateFileContents(payload);
};

const getBadgeContentInBase64FromUrl = async (badgeUrl) => {
  const response = await fetch(badgeUrl);
  const badgeContent = await response.buffer();
  return badgeContent.toString('base64');
};

const getExistingShaBadgeFile = async (octokit, repoOwner, repoName, badgeFilePath, ref) => {
  let badgeContents = null;
  try {
    badgeContents = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path: badgeFilePath,
      ref: ref,
    });

    return badgeContents.data.sha;
  } catch (e) {
    console.log('badge not found', e);
    return null;
  }
};
