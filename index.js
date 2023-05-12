const core = require('@actions/core');
const axios = require('axios');

// Keeps only the keys specified in the keys array
function pluckObjectKeys(obj, keys) {
  return Object.keys(obj)
    .filter(key => keys.includes(key))
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});
}

(async () => {
  try {
    //
    // Retrieve inputs
    //
    const org = core.getInput('organization');
    console.log(`Pulumi org: ${org}`);
    const project = core.getInput('project');
    console.log(`Pulumi project: ${project}`);
    const stack = core.getInput('stack');
    console.log(`Project stack: ${stack}`);

    const resourceName = core.getInput('resource');
    const resourceNames = core.getMultilineInput('resources');
    if (resourceName) {
      if (typeof resourceName !== 'string') {
        throw new Error('Requested resource must be a string!');
      }
      console.log(`Requested resource: ${resourceName}`);
    } else if (resourceNames) {
      if (!Array.isArray(resourceNames)) {
        throw new Error('Requested resources must be an array!');
      }
      console.log(`Requested resources: ${resourceNames}`);
    } else {
      console.log(`Requested all available resources`);
    }

    const accessToken = core.getInput('access-token');
    console.log(
      `${
        accessToken
          ? 'Access token was provided!'
          : 'Access token was not provided!'
      }`
    );

    //
    // Engage in retrieval of the stack's outputs
    //
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

    let resourceObject = null;

    if (
      response.data?.deployment?.resources &&
      Array.isArray(response.data.deployment.resources)
    ) {
      resourceObject = response.data.deployment.resources.find(
        r => r.type === 'pulumi:pulumi:Stack'
      );
    }

    if (!resourceObject?.outputs) {
      throw new Error('No resources were found!');
    }

    //
    // Set outputs
    //
    if (resourceName) {
      core.setOutput(
        'resource-outputs',
        pluckObjectKeys(resourceObject.outputs, [resourceName])
      );
    } else if (resourceNames) {
      core.setOutput(
        'resource-outputs',
        pluckObjectKeys(resourceObject.outputs, resourceNames)
      );
    } else {
      core.setOutput('resource-outputs', resourceObject.outputs);
    }

    // set 'resource-output' for backwards compatibility
    core.setOutput(
      'resource-output',
      resourceName ? resourceObject.outputs[`${resourceName}`] || '' : ''
    );
  } catch (error) {
    core.setFailed(error.message);
  }
})();
