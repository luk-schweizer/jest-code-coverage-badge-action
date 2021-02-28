const coverage= require('../coverage');
const core = require('@actions/core'); // eslint-disable-line
jest.mock('@actions/core');

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules(); // Reset cache
});

test('percentage should return 85.19 when coverageType is statements and clover.xml file has metrics with 108 statements and 92 coveredstatements', async () => {
  core.getInput = jest.fn(()=>'statements');

  const result = await coverage.percentage('./tests/coverage/clover.xml');

  expect(result).toBe('85.19');
});

test('percentage should return 85.71 when coverageType is conditionals and clover.xml file has metrics with 35 conditionals and 30 coveredconditionals', async () => {
  core.getInput = jest.fn(()=>'conditionals');

  const result = await coverage.percentage('./tests/coverage/clover.xml');

  expect(result).toBe('85.71');
});

test('percentage should return 83.33 when coverageType is methods and clover.xml file has metrics with 24 methods and 20 coveredmethods', async () => {
  core.getInput = jest.fn(()=>'methods');

  const result = await coverage.percentage('./tests/coverage/clover.xml');

  expect(result).toBe('83.33');
});

test('percentage should return null when coverageType is notexpectedvalue and clover.xml file has metrics', async () => {
  core.getInput = jest.fn(()=>'notexpectedvalue');

  try {
    await coverage.percentage('./tests/coverage/clover.xml');
  } catch (e) {
    expect(e.message).toBe('Input coverage-type notexpectedvalue is not recognized. Valid values are statements,methods,conditionals');
  }
});

test('percentage should return 0 when coverageType is statements and clover-empty.xml file has metrics with 0 statements and 0 coveredstatements', async () => {
  core.getInput = jest.fn(()=>'statements');

  const result = await coverage.percentage('./tests/coverage/clover-empty.xml', 'statements');

  expect(result).toBe('0');
});

test('percentage should return 0 when coverageType is conditionals and clover-empty.xml file has metrics with 0 conditionals and 0 coveredconditionals', async () => {
  core.getInput = jest.fn(()=>'conditionals');

  const result = await coverage.percentage('./tests/coverage/clover-empty.xml');

  expect(result).toBe('0');
});

test('percentage should return 0 when coverageType is methods and clover-empty.xml file has metrics with 0 methods and 0 coveredmethods', async () => {
  core.getInput = jest.fn(()=>'methods');

  const result = await coverage.percentage('./tests/coverage/clover-empty.xml');

  expect(result).toBe('0');
});


test('percentage should throw an exception when file is clover-not-exists.xml', async () => {
  core.getInput = jest.fn(()=>'methods');

  try {
    await coverage.percentage('./tests/coverage/clover-not-exists.xml');
  } catch (e) {
    expect(e.message).toBe('ENOENT: no such file or directory, open \'./tests/coverage/clover-not-exists.xml\'');
  }
});
