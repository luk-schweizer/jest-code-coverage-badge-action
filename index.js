const core = require('@actions/core');
const exec = require('@actions/exec');
const BadgeFile = require('./badge-file');
const BadgeUrl = require('./badge-url');
const coverage = require('./coverage');

async function run() {
  const testCommand = core.getInput('test-command');
  await exec.exec(testCommand);

  const coveragePercentage = await coverage.percentage('./coverage/clover.xml');

  const badgeUrl = BadgeUrl.generateUrl(coveragePercentage);
  const badgeFilePath = core.getInput('create-file-path');
  if (badgeFilePath) {
    await BadgeFile.createOrUpdate(badgeFilePath, badgeUrl);
  }
  core.setOutput('BADGE_URL', badgeUrl);
}

run().catch((err) => core.setFailed(err.message));
