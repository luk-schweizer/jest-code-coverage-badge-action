const dummyModule= require('./dummy');

test('dummyModule.run should return true', () => {
  const result = dummyModule.run();
  expect(result).toBe(true);
});