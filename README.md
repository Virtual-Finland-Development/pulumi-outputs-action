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

The name of the Pulumi resource whose output you wish to get. Conditions for this input:

- if `resource` is defined, `resources` is ignored
- if both `resource` and `resources` are not defined, all available resources are returned.

### `resources`

List of names of the Pulumi resource whose output you wish to get. Conditions for this input:

- if `resource` is defined, this input is ignored
- if both `resource` and `resources` are not defined, all available resources are returned.

### `access-token`

**Required** Pulumi access token.

## Outputs

### `resource-outputs`

Key-value object map of the requested resources.

### `resource-output`

String output of the requested resource. Has a non-zero lenght value only if `resource` input is defined.

## Example usage

Get resources:

```yaml
- name: Get Pulumi resource output
    id: action-id
    uses: Virtual-Finland-Development/pulumi-outputs-action@v1
    with:
        organization: organization-name
        project: project-name
        stack: dev
        resources: ['endpointUrl', 'another']
        access-token: ${{ secrets.PULUMI_ACCESS_TOKEN }}
- name: Get the outputs
    run: |
        echo 'The endpointUrl output was ${{ steps.action-id.outputs.resource-outputs.endpointUrl }}'
        echo 'The another output was ${{ steps.action-id.outputs.resource-outputs.another }}'
```

Get a single resource:

```yaml
- name: Get Pulumi resource output
    id: action-id
    uses: Virtual-Finland-Development/pulumi-outputs-action@v1
    with:
        organization: organization-name
        project: project-name
        stack: dev
        resource: endpointUrl
        access-token: ${{ secrets.PULUMI_ACCESS_TOKEN }}
- name: Get the output
    run: |
        echo 'The endpointUrl output was: ${{ steps.action-id.outputs.resource-outputs.endpointUrl }}'
        echo 'Backwards compatibilite syntax for endpointUrl output: resource-output=${{ steps.action-id.outputs.resource-output }}'
```
