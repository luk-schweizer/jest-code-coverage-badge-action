const fetch = require('node-fetch');
const retry = require('p-retry');
const baseUrl = 'https://api.keyvalue.xyz';

module.exports = {

  isUrlValid: (url) => {
    return /^https:\/\/api\.keyvalue\.xyz\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(url);
  },

  createNewUrl: async () => {
    const response = await retry(() => fetch(`${baseUrl}/new/coverage`, {method: 'post', timeout: 1000}), {retries: 3});
    const url = await response.text();
    return url.replace('\n', '');
  },

  setKeyValue: async (url, objectValue) => {
    const response = await retry(() => fetch(url, {
      method: 'post',
      body: JSON.stringify(objectValue),
      headers: {'Content-Type': 'text/plain'},
      timeout: 1000,
    }), {retries: 3});
    const data = await response.text();
    return data;
  },
};
