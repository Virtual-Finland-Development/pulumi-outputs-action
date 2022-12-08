const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

try {
  const org = core.getInput('pulumi-organization');
  console.log(`Org ${org}!`);
  const project = core.getInput('pulumi-project');
  console.log(`Project ${project}!`);
  const stack = core.getInput('pulumi-stack');
  console.log(`Stack ${stack}!`);
  const resourceName = core.getInput('pulumi-resource');
  console.log(`Resource ${resource}!`);
  const accessToken = core.getInput('pulumi-access-token');
  console.log(`Resource ${resource}!`);

  const url = `https://api.pulumi.com/api/stacks/${org}/${project}/${stack}/export`;

  const response = axios({
    method: 'get',
    url,
    headers: {
      Accept: 'application/vnd.pulumi+8',
      'Content-Type': 'application/json',
      Authorization: `token ${accessToken}`,
    },
  });

  let resourceOutput = '';

  const resourceObject = esponse.data.deployment?.resources?.find(
    r => r.type === 'pulumi:pulumi:Stack'
  );

  if (resourceObject) {
    resourceOutput = resourceObject.outputs[`${resourceName}`] || '';
  }

  core.setOutput('resource-output', response.data?.deployment?.resources);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}