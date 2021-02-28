const core = require('@actions/core');

module.exports.generateUrl = (coverage) => {
  const colorConfiguration = core.getInput('badge-color-configuration');
  const label = core.getInput('badge-label');

  let color = getColor(JSON.parse(colorConfiguration), coverage);
  if (!color) {
    color = 'blue';
  }
  return encodeURI(`https://img.shields.io/badge/${label}-${coverage}%-${color}`);
};

const getColor = (colorConfiguration, coverage) => {
  const configsFound = colorConfiguration
      .filter((config) => (!config['>=']) || (config['>='] && coverage>=config['>=']))
      .filter((config) => (!config['<='] || config['<='] && coverage<=config['<=']))
      .filter((config) => (!config['>'] || config['>'] && coverage>config['>']))
      .filter((config) => (!config['<'] || config['<'] && coverage<config['<']))
      .map((config) => config.color);
  return configsFound.shift();
};
