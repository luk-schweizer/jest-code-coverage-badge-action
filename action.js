const core = require('@actions/core');
const exec = require('@actions/exec');
const keyValueAsService = require('./keyValueAsService');
const coverage = require('./coverage');
const badge = require('./badge');

module.exports.run = async () => {
  const testCommand = core.getInput('test-command');
  await exec.exec(testCommand);

  const coverageType = getCoverageType();
  const coveragePercentage = await coverage.percentage('./coverage/clover.xml', coverageType);

  const schema = getCoverageSchema(coveragePercentage);

  const kvaasKeyUrl = await getKeyValueAsServiceUrl();
  await keyValueAsService.setKeyValue(kvaasKeyUrl, schema);

  core.setOutput('BADGE_URL', encodeURI(`https://img.shields.io/endpoint?url=${kvaasKeyUrl}`));
};

const getCoverageType = () => {
  const coverageType = core.getInput('coverage-type');
  if (!coverage.isValidType(coverageType)) throw new Error('Input coverage-type is not recognized');
  return coverageType;
};

const getKeyValueAsServiceUrl = async () => {
  const kvaasKeyUrl = core.getInput('kvaas-key-url');
  if (!kvaasKeyUrl) {
    return await keyValueAsService.createNewUrl();
  }

  if (!keyValueAsService.isUrlValid(kvaasKeyUrl)) throw new Error('Input kvaas-key-url is not valid');
  return kvaasKeyUrl;
};

const getCoverageSchema = (coveragePercentage) => {
  const colorConfiguration = JSON.parse(core.getInput('badge-color-configuration'));
  const label = core.getInput('badge-label');
  const showJestLogo = core.getInput('badge-logo');

  return badge.schema(coveragePercentage, label, colorConfiguration, showJestLogo);
};
