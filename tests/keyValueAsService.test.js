const fetch = require('node-fetch'); // eslint-disable-line
const keyValueAsService= require('../keyValueAsService');
jest.mock('node-fetch');

beforeEach(() => {
  jest.clearAllMocks();
});


test('isUrlValid should return a true when URL is https://api.keyvalue.xyz/2hsyy27ed/coverage', () => {
  const isValid = keyValueAsService.isUrlValid('https://api.keyvalue.xyz/2hsyy27ed/coverage');

  expect(isValid).toBe(true);
});

test('isUrlValid should return a true when URL is https://api.keyvalue.xyz/yg5egsa/myCustomKey', () => {
  const isValid = keyValueAsService.isUrlValid('https://api.keyvalue.xyz/yg5egsa/myCustomKey');

  expect(isValid).toBe(true);
});

test('isUrlValid should return a false when URL is https://api.keyvalue.xyz/2hsyy27ed', () => {
  const isValid = keyValueAsService.isUrlValid('https://api.keyvalue.xyz/2hsyy27ed');

  expect(isValid).toBe(false);
});

test('isUrlValid should return a false when URL is https://api.keyvalue.xyz/coverage', () => {
  const isValid = keyValueAsService.isUrlValid('https://api.keyvalue.xyz/coverage');

  expect(isValid).toBe(false);
});


test('isUrlValid should return a false when URL is http://api.keyvalue.xyz/2hsyy27ed/coverage', () => {
  const isValid = keyValueAsService.isUrlValid('http://api.keyvalue.xyz/2hsyy27ed/coverage');

  expect(isValid).toBe(false);
});

test('isUrlValid should return a false when URL is httpa://anotherdomain.xyz/2hsyy27ed/coverage', () => {
  const isValid = keyValueAsService.isUrlValid('https://anotherdomain.xyz/2hsyy27ed/coverage');

  expect(isValid).toBe(false);
});


test('createNewUrl should post to https://api.keyvalue.xyz/new/coverage and return https://api.keyvalue.xyz/hsdfg726f/coverage', async () => {
  fetch.mockResolvedValue({
    text: async () => 'https://api.keyvalue.xyz/hsdfg726f/coverage',
  });

  const url = await keyValueAsService.createNewUrl();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('https://api.keyvalue.xyz/new/coverage', {method: 'post'});
  expect(url).toBe('https://api.keyvalue.xyz/hsdfg726f/coverage');
});


test('putCoverageValue should post to url the objectValue', async () => {
  const objectValue = {
    'schemaVersion': 1,
    'label': 'coverage',
    'message': '80%',
    'color': 'green',
    'namedLogo': 'jest',
  };

  await keyValueAsService.setKeyValue('url', objectValue);

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('url', {
    method: 'post',
    body: JSON.stringify(objectValue),
    headers: {'Content-Type': 'text/plain'},
  });
});
