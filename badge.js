module.exports.schema = (coveragePercentage, label, colorConfiguration, showJestLogo) => {
  let color = getColor(colorConfiguration, coveragePercentage);

  if (!color) color = 'blue';

  const schema = {
    schemaVersion: 1,
    label: label,
    message: `${coveragePercentage}%`,
    color: color,
    style: 'plastic',
  };

  if (showJestLogo) schema.namedLogo = 'jest';

  return schema;
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
