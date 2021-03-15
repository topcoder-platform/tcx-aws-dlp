import { handle } from './DLPTrigger/lambda'
import * as aws from 'aws-lambda'
import util from 'util'
import fs from 'fs'

/**
 * A fake AWS lambda context
 */
const context: aws.Context = {
  awsRequestId: '',
  callbackWaitsForEmptyEventLoop: false,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  logGroupName: '',
  logStreamName: '',
  memoryLimitInMB: '',
  done (error?: Error, result?: any): void {
    if (error) {
      console.error(error)
    }
  },
  fail (error: Error | string): void {
    if (error) {
      console.error(error)
    }
  },
  getRemainingTimeInMillis (): number {
    return 0
  },
  succeed (messageOrObject: any, object?: any): void {
  }
}

/**
 * A simpler query parameters type that's compatible with aws-lambda's definition.
 */
type QueryParameters = { [name: string]: string | undefined } | null

/**
 * Make an APIGatewayEvent from the given parameters.
 * @param httpMethod HTTP method
 * @param query query parameters
 * @param body body
 */
function makeEvent (httpMethod: string, query: QueryParameters, body: string | null): aws.APIGatewayEvent {
  return {
    body: body,
    headers: {},
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
    path: '/api/dlptrigger',
    pathParameters: null,
    queryStringParameters: query,
    requestContext: {
      resourceId: 'br9elc',
      resourcePath: '/api/dlptrigger',
      httpMethod: 'GET',
      extendedRequestId: 'btic8EQVIAMFTqQ=',
      requestTime: '05/Mar/2021:11:35:33 +0000',
      path: '/dev/api/dlptrigger',
      accountId: '494813232617',
      protocol: 'HTTP/1.1',
      stage: 'dev',
      domainPrefix: 'yrikx2ockb',
      requestTimeEpoch: 1614944133961,
      requestId: '2ed19101-0aba-4768-a98a-1e2a1f6ed88e',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '125.168.196.118',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'curl/7.64.1',
        user: null,
        apiKey: '',
        apiKeyId: ''
      },
      domainName: 'yrikx2ockb.execute-api.us-east-1.amazonaws.com',
      apiId: 'yrikx2ockb',
      authorizer: null
    },
    resource: '',
    stageVariables: null,
    httpMethod
  }
}

/**
 * Simulate post request to the AWS lambda handler.
 */
async function postRequest () {
  const event = makeEvent('POST', null, fs.readFileSync('./DLPTrigger/sample-payloads/bug/bug-created.json', 'utf-8'))
  return await handle(event, context)
}

/**
 * Simulate get request to the AWS lambda handler.
 */
async function getRequest () {
  const event: aws.APIGatewayEvent = makeEvent('GET', {
    project_id: 'dc2d3852-e28c-4bc3-aa3c-a7a457456730',
    resource_id: '39'
  }, null)
  return await handle(event, context)
}

/**
 * Entry point for the test code
 */
async function main () {
  console.log(util.inspect(await postRequest(), { showHidden: true, depth: null }))
  console.log(util.inspect(await getRequest(), { showHidden: true, depth: null }))
}

main()
  .catch(err => {
    console.error(err)
  })
