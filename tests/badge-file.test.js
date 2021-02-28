const github = require('@actions/github');
const core = require('@actions/core');
const fetch = require('node-fetch');

const BadgeFile = require('../badge-file');

jest.mock('@actions/github');
jest.mock('@actions/core');
jest.mock('node-fetch');

const octokit = {repos: {}};

beforeAll(() => {
  core.getInput = jest.fn(()=> 'token');

  octokit.repos.createOrUpdateFileContents = jest.fn();

  github.context = {repo: {repo: 'repository', owner: 'owner'}, ref: 'reference', job: 'job', runId: 'runId', runNumber: 'runNumber'};
  github.getOctokit.mockReturnValue(octokit);

  fetch.mockResolvedValue({buffer: () => 'buffer'});
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('createOrUpdate should call createOrUpdate files in github with sha null in payload when badge does not exists in github repo', async () => {
  octokit.repos.getContent = jest.fn().mockResolvedValue({data: {sha: null}});

  await BadgeFile.createOrUpdate('./coverage/badge.svg', 'http://url.to.get.badge.contents');

  const expectedPayload = {
    owner: 'owner',
    repo: 'repository',
    path: './coverage/badge.svg',
    message: `Code Coverage Badge for Run job-runId-runNumber`,
    content: 'buffer',
    branch: 'reference',
  };
  expect(octokit.repos.getContent).toHaveBeenCalledTimes(1);
  expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledTimes(1);
  expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledWith(expectedPayload);
});


test('createOrUpdate should call createOrUpdate files in github with sha not null in payload when badge does exists in github repo', async () => {
  octokit.repos.getContent = jest.fn().mockResolvedValue({data: {sha: 'shaOfExistingBadge'}});

  await BadgeFile.createOrUpdate('./coverage/badge.svg', 'http://url.to.get.badge.contents');

  const expectedPayload = {
    owner: 'owner',
    repo: 'repository',
    path: './coverage/badge.svg',
    message: `Code Coverage Badge for Run job-runId-runNumber`,
    content: 'buffer',
    branch: 'reference',
    sha: 'shaOfExistingBadge',
  };
  expect(octokit.repos.getContent).toHaveBeenCalledTimes(1);
  expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledTimes(1);
  expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledWith(expectedPayload);
});


test('createOrUpdate should call createOrUpdate files in github with file content taken from value in param badgeUrl', async () => {
  octokit.repos.getContent = jest.fn().mockResolvedValue({data: {sha: 'shaOfExistingBadge'}});

  await BadgeFile.createOrUpdate('./coverage/badge.svg', 'http://url.to.get.badge.contents');

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('http://url.to.get.badge.contents');
});
