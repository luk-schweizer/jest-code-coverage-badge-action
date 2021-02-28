const xml2js = require('xml2js');
const fs = require('fs');
const core = require('@actions/core');
const coverageTypes = ['statements', 'methods', 'conditionals'];

module.exports.percentage = async (filePath) => {
  const coverageType = core.getInput('coverage-type');
  if (!coverageTypes.includes(coverageType)) {
    throw new Error(`Input coverage-type ${coverageType} is not recognized. Valid values are ${coverageTypes}`);
  }

  const xmlFile = fs.readFileSync(filePath);
  const xmlFileData = await xml2js.parseStringPromise(xmlFile);
  const metrics = xmlFileData.coverage.project[0].metrics[0].$;

  const total = parseInt(metrics[coverageType]);
  const covered = parseInt(metrics[`covered${coverageType}`]);

  if (total == 0) return '0';

  const coverageRatio = covered/total;

  return (coverageRatio*100).toFixed(2);
};
