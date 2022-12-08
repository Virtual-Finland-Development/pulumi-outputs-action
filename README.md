# pulumi-outputs-action

Get output value from Pulumi application for defined inputs

## Inputs

### `organization`

**Required** The name of the Pulumi organization, in lowercase and with hyphens.

### `project`

**Required** The name of the Pulumi project, in lowercase and with hyphens.

### `stack`

**Required** The stack of the Pulumi project.

### `resource`

**Required** The name of the Pulumi resource whose output you wish to get.

### `access-token`

**Required** Pulumi access token.

## Outputs

### `resource-output`

The output for the requested resource.

## Example usage

```yaml
- name: Get Pulumi resource output
    id: pulumi-resource-output
    uses: Virtual-Finland-Development/pulumi-outputs-action@v1
    with:
        organization: organization-name
        project: project-name
        stack: dev
        resource: endpointUrl
        access-token: ${{ secrets.PULUMI_ACCESS_TOKEN }}
```
