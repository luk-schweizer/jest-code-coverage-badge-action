const core = require('@actions/core'); // eslint-disable-line
const BadgeUrl= require('../badge-url');
jest.mock('@actions/core');

beforeEach(() => {
  jest.clearAllMocks();
});

test('generateUrl should return a url with label coverage, percentage 80 and color green when badge-label input is coverage, parameter is 80 and badge-color-configuration has rule defined to set green when coverage is 80', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[{"color": "red", ">=": 0, "<": 30 }, {"color": "orange", ">=": 30, "<": 40 },{"color": "yellow", ">=": 40, "<": 60 },{"color": "yellowgreen", ">=": 60, "<": 75 },{"color": "green", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      case 'badge-label':
        return 'coverage';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(80);

  expect(url).toBe('https://img.shields.io/badge/coverage-80%25-green');
});

test('generateUrl should return a url with label coveragepercentage, percentage 81 and color red when badge-label input is coveragepercentage, parameter is 81 and badge-color-configuration has rule defined to set red when coverage is between 75 and 90', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[{"color": "green", ">=": 0, "<": 30.6 },{"color": "red", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      case 'badge-label':
        return 'coveragepercentage';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(81);

  expect(url).toBe('https://img.shields.io/badge/coveragepercentage-81%25-red');
});


test('generateUrl should return a url with label coverageWithString, percentage 81 and color red when badge-label input is coverageWithString, parameter is 81 and badge-color-configuration has rule defined to set red when coverage is between "81" and "90" as string', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[{"color": "green", ">=": "0", "<": "30" },{"color": "red", ">=": "81", "<": "90" },{"color": "brightgreen", ">=": "90", "<=": "100" }]';
        break;
      case 'badge-label':
        return 'coverageWithString';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(81);

  expect(url).toBe('https://img.shields.io/badge/coverageWithString-81%25-red');
});


test('generateUrl should return a url with label coverageWithDecimal, percentage 30.5 and color orange when badge-label input is coverageWithDecimal, parameter is 30.5 and badge-color-configuration has rule defined to set orange when coverage is between 30 and 40', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[{"color": "red", ">=": 0, "<": 30 }, {"color": "orange", ">=": 30, "<": 40 },{"color": "yellow", ">=": 40, "<": 60 },{"color": "yellowgreen", ">=": 60, "<": 75 },{"color": "green", ">=": 75, "<": 90 },{"color": "brightgreen", ">=": 90, "<=": 100 }]';
        break;
      case 'badge-label':
        return 'coverageWithDecimal';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(30.5);

  expect(url).toBe('https://img.shields.io/badge/coverageWithDecimal-30.5%25-orange');
});


test('generateUrl should return a url with label coverage, percentage 50 and color green when badge-label input is coverage, parameter is 50 and badge-color-configuration has rule one rule with no conditions with color green', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[{"color": "green"}]';
        break;
      case 'badge-label':
        return 'coverage';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(50);

  expect(url).toBe('https://img.shields.io/badge/coverage-50%25-green');
});

test('generateUrl should return a url with label coverage, percentage 10 and color green when badge-label input is coverage, parameter is 10 and badge-color-configuration has rule defined to set orange when coverage is greater than 5', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[{"color": "green", ">": 5}]';
        break;
      case 'badge-label':
        return 'coverage';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(10);

  expect(url).toBe('https://img.shields.io/badge/coverage-10%25-green');
});


test('generateUrl should return a url with label coverage, percentage 2 and color blue (default) when badge-label input is coverage, parameter is 2 and badge-color-configuration there is no rule for coverage 2', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[{"color": "green", ">": 5}]';
        break;
      case 'badge-label':
        return 'coverage';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(2);

  expect(url).toBe('https://img.shields.io/badge/coverage-2%25-blue');
});


test('generateUrl should return a url with label coverage, percentage 1 and color blue (default) when badge-label input is coverage, parameter is 1 and badge-color-configuration there is no rule defined', () => {
  core.getInput = jest.fn((input) => {
    switch (input) {
      case 'badge-color-configuration':
        return '[]';
        break;
      case 'badge-label':
        return 'coverage';
        break;
    }
  });

  const url = BadgeUrl.generateUrl(1);

  expect(url).toBe('https://img.shields.io/badge/coverage-1%25-blue');
});
