# Topcoder X - DLP scanning AWS implementation

## Prerequisites

1. NodeJs 12.x
2. [AWS cli](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed and configured.
3. [eksctl](https://docs.aws.amazon.com/eks/latest/userguide/eksctl.html) installed.
4. [Helm 3](https://helm.sh/docs/intro/install/) installed and working on the local machine.
5. [kubectl](https://kubernetes.io/docs/tasks/tools/) installed.
5. Please make sure `aws`, `eksctl`, `kubectl` and `helm` are accessible from $PATH environment


## Install dependencies

```
npm install
```

## Deploy on AWS

1. Review environment variables in `deploy/env.sh`:
  - AWS_REGION        - AWS region to deploy everything in, default: us-west-1
  - EKS_CLUSTER_NAME  - EKS cluster name, default: prod-tcx-ado-dlp-cluster 
  - EKS_NODE_TYPE     - EKS cluster node type, default: t3.medium'
  - EKS_NODES_COUNT   - Number of nodes in the EKS cluster, default: 3
  - EKS_NODES_MIN     - Minimum number of nodes, default: 3
  - EKS_NODES_MAX     - Maximum number of nodes, default: 3
 
2. Deploy everything by running the following command:

```bash
deploy/deploy-all.sh
``` 

The above command will:
 1. create an EKS cluster (`./deploy/create-eks.sh`)
 2. deploy presidio to the EKS cluster (`./deploy/deploy-presidio.sh`)
 3. deploy the webhook as an AWS lambda function (`./deploy/deploy-dlp-trigger.sh`)
 
## Running the webhook locally

The `serverless-offline` plugin was added to enable running the function locally.

1. The webhook requires a running Presidio analyze service and the environment variable `PRESIDIO_ENDPOINT` set.

```
# See deploy/deploy-dlp-trigger.sh for an example of setting this environment variable
export PRESIDIO_ENDPOINT=http://<presidio-analyze-service-host>/analyze
```

2. Run a local serverless function:

```
npm start
```

or

```
sls offline
```

## Testing the webhook

If you have successfully deployed the webhook to AWS lambda, the deploy script would have printed the API gateway url and supported methods, for example:

```
  GET - https://9pcza605q6.execute-api.us-west-1.amazonaws.com/dev/api/dlptrigger
  POST - https://9pcza605q6.execute-api.us-west-1.amazonaws.com/dev/api/dlptrigger
  OPTIONS - https://9pcza605q6.execute-api.us-west-1.amazonaws.com/dev/api/dlptrigger
```

You can use the `curl` command to test those endpoints:

```
# 1. OPTIONS
curl -X OPTIONS <endpoint_url>
# 2. POST scan a resource
curl -X POST -H 'Content-Type: application/json' \
  -d @./DLPTrigger/sample-payloads/issue/issue-created.json \
  <endpoint_url>
# 3. GET scan result
curl '<endpoint_url>?project_id=dc2d3852-e28c-4bc3-aa3c-a7a457456730&resource_id=42'
``` 
