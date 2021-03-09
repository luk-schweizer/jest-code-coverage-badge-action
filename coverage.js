const xml2js = require('xml2js');
const fs = require('fs');
const coverageTypes = ['statements', 'methods', 'conditionals'];

module.exports = {
  isValidType: (type) => {
    return !coverageTypes.includes(type);
  },

  percentage: async (filePath, type) => {
    const xmlFile = fs.readFileSync(filePath);
    const xmlFileData = await xml2js.parseStringPromise(xmlFile);
    const metrics = xmlFileData.coverage.project[0].metrics[0].$;

    const total = parseInt(metrics[type]);
    const covered = parseInt(metrics[`covered${type}`]);

    if (total == 0) return '0';

    const coverageRatio = covered/total;

    return (coverageRatio*100).toFixed(2);
  },


};
