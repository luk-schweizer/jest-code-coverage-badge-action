const badge= require('../badge');

beforeEach(() => {
  jest.clearAllMocks();
});

test('schema should return an object with label coverage, percentage 80 and color green when label is coverage, coveragePercentage is 80 and colorConfiguration has rule defined to set green when coverage is 80', () => {
  const colorConfiguration = [{'color': 'red', '>=': 0, '<': 30}, {'color': 'orange', '>=': 30, '<': 40}, {'color': 'yellow', '>=': 40, '<': 60}, {'color': 'yellowgreen', '>=': 60, '<': 75}, {'color': 'green', '>=': 75, '<': 90}, {'color': 'brightgreen', '>=': 90, '<=': 100}];

  const badgeSchema = badge.schema(80, 'coverage', colorConfiguration, true);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coverage',
    'message': '80%',
    'color': 'green',
    'style': 'plastic',
    'namedLogo': 'jest',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});

test('schema should return an object with label coveragepercentage, percentage 81 and color red when label is coveragepercentage, percentage is 81 and colorConfiguration has rule defined to set red when coverage is between 75 and 90', () => {
  const colorConfiguration = [{'color': 'green', '>=': 0, '<': 30.6}, {'color': 'red', '>=': 75, '<': 90}, {'color': 'brightgreen', '>=': 90, '<=': 100}];

  const badgeSchema = badge.schema(81, 'coveragepercentage', colorConfiguration, true);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coveragepercentage',
    'message': '81%',
    'color': 'red',
    'style': 'plastic',
    'namedLogo': 'jest',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});


test('schema should return an object with label coverageWithString, percentage 81 and color red when label is coverageWithString, percentage is 81 and colorConfiguration has rule defined to set red when coverage is between "81" and "90" as string', () => {
  const colorConfiguration = [{'color': 'green', '>=': '0', '<': '30'}, {'color': 'red', '>=': '81', '<': '90'}, {'color': 'brightgreen', '>=': '90', '<=': '100'}];

  const badgeSchema = badge.schema(81, 'coverageWithString', colorConfiguration, false);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coverageWithString',
    'message': '81%',
    'color': 'red',
    'style': 'plastic',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});


test('schema should return an object with label coverageWithDecimal, percentage 30.5 and color orange when label is coverageWithDecimal, percentage is 30.5 and colorConfiguration has rule defined to set orange when coverage is between 30 and 40', () => {
  const colorConfiguration = [{'color': 'red', '>=': 0, '<': 30}, {'color': 'orange', '>=': 30, '<': 40}, {'color': 'yellow', '>=': 40, '<': 60}, {'color': 'yellowgreen', '>=': 60, '<': 75}, {'color': 'green', '>=': 75, '<': 90}, {'color': 'brightgreen', '>=': 90, '<=': 100}];

  const badgeSchema = badge.schema(30.5, 'coverageWithDecimal', colorConfiguration, true);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coverageWithDecimal',
    'message': '30.5%',
    'color': 'orange',
    'style': 'plastic',
    'namedLogo': 'jest',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});


test('schema should return an object with label coverage, percentage 50 and color green when label is coverage, percentage is 50 and colorConfiguration has rule one rule with no conditions with color green', () => {
  const colorConfiguration = [{'color': 'green'}];

  const badgeSchema = badge.schema(50, 'coverage', colorConfiguration, true);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coverage',
    'message': '50%',
    'color': 'green',
    'style': 'plastic',
    'namedLogo': 'jest',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});

test('schema should return an object with label coverage, percentage 10 and color green when label is coverage, percentage is 10 and colorConfiguration has rule defined to set orange when coverage is greater than 5', () => {
  const colorConfiguration = [{'color': 'green', '>': 5}];

  const badgeSchema = badge.schema(10, 'coverage', colorConfiguration, true);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coverage',
    'message': '10%',
    'color': 'green',
    'style': 'plastic',
    'namedLogo': 'jest',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});


test('schema should return an object with label coverage, percentage 2 and color blue (default) when label is coverage, percentage is 2 and colorConfiguration there is no rule for coverage 2', () => {
  const colorConfiguration = [{'color': 'green', '>': 5}];

  const badgeSchema = badge.schema(2, 'coverage', colorConfiguration, true);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coverage',
    'message': '2%',
    'color': 'blue',
    'style': 'plastic',
    'namedLogo': 'jest',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});


test('schema should return an object with label coverage, percentage 1 and color blue (default) when label is coverage, percentage is 1 and colorConfiguration there is no rule defined', () => {
  const colorConfiguration = [];

  const badgeSchema = badge.schema(1, 'coverage', colorConfiguration, true);

  const expectedBody = {
    'schemaVersion': 1,
    'label': 'coverage',
    'message': '1%',
    'color': 'blue',
    'style': 'plastic',
    'namedLogo': 'jest',
  };

  expect(badgeSchema).toStrictEqual(expectedBody);
});

