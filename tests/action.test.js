const core = require('@actions/core');
const exec = require('@actions/exec');
const keyValueAsService = require('../keyValueAsService');
const coverage = require('../coverage');
const badge = require('../badge');
const action = require('../action');

jest.mock('@actions/core');
jest.mock('@actions/exec');
jest.mock('../keyValueAsService');
jest.mock('../coverage');
jest.mock('../badge');

beforeEach(() => {
  jest.clearAllMocks();
});

test('run should execute command "npm jest --coverage" when test-command input is "npm jest --coverage"', async () => {
  coverage.isValidType = jest.fn(() => true);
  keyValueAsService.isValidKeyUrl = jest.fn(() => true);

  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'test-command':
        return 'npm jest --coverage';
        break;
      case 'badge-color-configuration':
        return '[{"color": "green", ">=": 0, "<": 30.6 },{"color": "red", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      default:
        return 'input';
        break;
    }
  });

  await action.run();

  expect(exec.exec).toHaveBeenCalledTimes(1);
  expect(exec.exec).toHaveBeenCalledWith('npm jest --coverage');
});


test('run should call coverage.percentage with path ./coverage/clover.xml and coverageType statements when coverage-type input is statements', async () => {
  coverage.isValidType = jest.fn(() => true);
  keyValueAsService.isValidKeyUrl = jest.fn(() => true);

  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'coverage-type':
        return 'statements';
        break;
      case 'badge-color-configuration':
        return '[{"color": "green", ">=": 0, "<": 30.6 },{"color": "red", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      default:
        return 'input';
        break;
    }
  });

  await action.run();

  expect(coverage.percentage).toHaveBeenCalledTimes(1);
  expect(coverage.percentage).toHaveBeenCalledWith('./coverage/clover.xml', 'statements');
});

test('run should throw error when coverageType is not valid', async () => {
  coverage.isValidType = jest.fn(() => false);

  try {
    await action.run();
  } catch (e) {
    expect(e.message).toBe('Input coverage-type is not recognized');
  }
});

test('run should call badge.schema with coveragePercentage 10, label coverage, colorConfiguration [{color: "green"}] and showJestLogo true when coverage.percentage returns 10, badge-label input is coverage,  badge-color-configuration input is [{"color": "green"}], badge-logo input is true', async () => {
  coverage.isValidType = jest.fn(() => true);
  coverage.percentage.mockResolvedValue(10);
  keyValueAsService.isValidKeyUrl = jest.fn(() => true);

  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-logo':
        return true;
        break;
      case 'badge-label':
        return 'coverage';
        break;
      case 'badge-color-configuration':
        return '[{"color": "green"}]';
        break;
      default:
        return 'input';
        break;
    }
  });

  await action.run();

  expect(badge.schema).toHaveBeenCalledTimes(1);
  expect(badge.schema).toHaveBeenCalledWith(10, 'coverage', [{color: 'green'}], true);
});

test('run should call keyValueAsService.createNewUrl when kvaas-key-url input is null', async () => {
  coverage.isValidType = jest.fn(() => true);
  keyValueAsService.isValidKeyUrl = jest.fn(() => true);

  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'kvaas-key-url':
        return null;
        break;
      case 'badge-color-configuration':
        return '[{"color": "green", ">=": 0, "<": 30.6 },{"color": "red", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      default:
        return 'input';
        break;
    }
  });

  await action.run();

  expect(keyValueAsService.createNewUrl).toHaveBeenCalledTimes(1);
});

test('run should throw error when kvaas-key-url input is not valid', async () => {
  coverage.isValidType = jest.fn(() => true);
  keyValueAsService.isValidKeyUrl = jest.fn(() => false);
  try {
    await action.run();
  } catch (e) {
    expect(e.message).toBe('Input kvaas-key-url is not valid');
  }
});


test('run should call keyValueAsService.setKeyValue with "url" and {schema:1} when kvaas-key-url input is "url" and valid, and badge.schema returns {schema:1}', async () => {
  coverage.isValidType = jest.fn(() => true);
  keyValueAsService.isValidKeyUrl = jest.fn(() => true);
  badge.schema = jest.fn(() => {
    return {schema: 1};
  });

  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'kvaas-key-url':
        return 'url';
        break;
      case 'badge-color-configuration':
        return '[{"color": "green", ">=": 0, "<": 30.6 },{"color": "red", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      default:
        return 'input';
        break;
    }
  });

  await action.run();

  expect(keyValueAsService.setKeyValue).toHaveBeenCalledTimes(1);
  expect(keyValueAsService.setKeyValue).toHaveBeenCalledWith('url', {schema: 1});
});


test('run should call core.setOutput with https://img.shields.io/endpoint?url=url when kvaas-key-url input is "kvaasUrl" and valid', async () => {
  coverage.isValidType = jest.fn(() => true);
  keyValueAsService.isValidKeyUrl = jest.fn(() => true);

  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'kvaas-key-url':
        return 'kvaasUrl';
        break;
      case 'badge-color-configuration':
        return '[{"color": "green", ">=": 0, "<": 30.6 },{"color": "red", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      default:
        return 'input';
        break;
    }
  });

  await action.run();

  expect(core.setOutput).toHaveBeenCalledTimes(1);
  expect(core.setOutput).toHaveBeenCalledWith('BADGE_URL', 'https://img.shields.io/endpoint?url=kvaasUrl');
});
