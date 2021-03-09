const fetch = require('node-fetch');

test('jest-code-coverage-badge-action output should return an svg badge with label coverage and value 100% when input label is coverage, coverage of test are 100% and key url is not provided', async () => {
  const outputUrl = process.env.BADGE_OUTPUT_WITH_URL_NOT_PROVIDED;

  const response = await fetch(outputUrl, {method: 'get'});
  const svg = await response.text();

  expect(svg).toMatch(/^<svg/);
  expect(svg).toMatch(/<text[^>]*>coverage<\/text>/);
  expect(svg).toMatch(/<text[^>]*>100%<\/text>/);
});

test('jest-code-coverage-badge-action output should return an svg badge with label coverage and value 100% when input label is coverageWithUrlProvided, coverage of test are 100% and key url is provided', async () => {
  const outputUrl = process.env.BADGE_OUTPUT_WITH_URL_PROVIDED;

  const response = await fetch(outputUrl, {method: 'get'});
  const svg = await response.text();

  expect(svg).toMatch(/^<svg/);
  expect(svg).toMatch(/<text[^>]*>coverageWithUrlProvided<\/text>/);
  expect(svg).toMatch(/<text[^>]*>100%<\/text>/);
});
