const action = require('./action');
const core = require('@actions/core');

async function run() {
  return action.run;
}
run().catch((err) => core.setFailed(err.message));
