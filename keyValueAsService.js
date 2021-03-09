const fetch = require('node-fetch');
const baseUrl = 'https://api.keyvalue.xyz';

module.exports = {

  isUrlValid: (url) => {
    return /^https:\/\/api\.keyvalue\.xyz\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(url);
  },

  createNewUrl: async () => {
    const response = await fetch(`${baseUrl}/new/coverage`, {method: 'post'});
    const url = await response.text();
    return url;
  },

  setKeyValue: async (url, objectValue) => {
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(objectValue),
      headers: {'Content-Type': 'text/plain'},
    });
    const data = await response.text();
    return data;
  },
};
