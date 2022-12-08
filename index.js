const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

(async () => {
  try {
    const org = core.getInput('pulumi-organization');
    console.log(`Org: ${org}`);
    const project = core.getInput('pulumi-project');
    console.log(`Project: ${project}`);
    const stack = core.getInput('pulumi-stack');
    console.log(`Stack: ${stack}`);
    const resourceName = core.getInput('pulumi-resource');
    console.log(`Resource: ${resourceName}`);
    const accessToken = core.getInput('pulumi-access-token');
    // console.log(`token ${accessToken}!`);

    const url = `https://api.pulumi.com/api/stacks/${org}/${project}/${stack}/export`;

    const response = await axios({
      method: 'get',
      url,
      headers: {
        Accept: 'application/vnd.pulumi+8',
        'Content-Type': 'application/json',
        Authorization: `token ${accessToken}`,
      },
    });

    console.log(response.data);

    let resourceOutput = '';

    const resourceObject = response.data.deployment?.resources?.find(
      r => r.type === 'pulumi:pulumi:Stack'
    );

    console.log('resourceObject:', resourceObject);

    if (resourceObject?.outputs) {
      console.log('outputs found!');
      resourceOutput = resourceObject.outputs[`${resourceName}`] || '';
    }

    core.setOutput('resource-output', resourceOutput);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
