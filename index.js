const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

(async () => {
  try {
    const org = core.getInput('pulumi-organization');
    console.log(`Pulumi org: ${org}`);
    const project = core.getInput('pulumi-project');
    console.log(`Pulumi project: ${project}`);
    const stack = core.getInput('pulumi-stack');
    console.log(`Project stack: ${stack}`);
    const resourceName = core.getInput('pulumi-resource');
    console.log(`Requested resource: ${resourceName}`);
    const accessToken = core.getInput('pulumi-access-token');
    console.log(
      `${
        accessToken
          ? 'Access token was provided!'
          : 'Access token was not provided!'
      }`
    );

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

    let resourceOutput = '';
    let resourceObject = null;

    if (response.data?.deployment?.resources) {
      resourceObject = response.data.deployment?.resources?.find(
        r => r.type === 'pulumi:pulumi:Stack'
      );
    }

    if (resourceObject?.outputs) {
      resourceOutput = resourceObject.outputs[`${resourceName}`] || '';
    }

    core.setOutput('resource-output', resourceOutput);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
