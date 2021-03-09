const action = require('./action');
const core = require('@actions/core');

action.run().catch((err) => core.setFailed(err.message));
