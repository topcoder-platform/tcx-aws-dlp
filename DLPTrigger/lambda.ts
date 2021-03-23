import * as aws from 'aws-lambda'
import handleGetRequest from './handlers/get'
import handlePostRequest from './handlers/post'
import handleOptionsRequest from './handlers/options'

/**
 * HTTP headers to be always returned to the client.
 */
const commonHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
  // eslint-disable-next-line quote-props
  'Vary': 'Accept-Encoding, Origin',
  'Content-Type': 'application/json'
}

/**
 * Entry point for the AWS lambda event handler.
 * @param event AWS lambda event
 * @param context AWS lambda context
 */
export async function handle (event: aws.APIGatewayEvent, context: aws.Context) {
  const headers = commonHeaders
  let statusCode = 200
  let body: any = null
  // Store lower-case version of the headers
  for (const key in event.headers) {
    event.headers[key.toLowerCase()] = event.headers[key];
  }

  try {
    switch (event.httpMethod) {
      case 'GET': {
        body = await handleGetRequest(event, context)
        break
      }
      case 'POST': {
        body = await handlePostRequest(event, context)
        break
      }
      case 'OPTIONS':
        const additionalHeaders = await handleOptionsRequest(event, context)
        const additionalCorsHeaders = {
          'Access-Control-Expose-Headers': Object.keys(additionalHeaders).join(' ')
        }
        Object.assign(
          headers,
          additionalHeaders,
          additionalCorsHeaders
        )
        break
      default:
        statusCode = 405
        body = { message: 'Unsupported Method.' }
        break
    }
    body = {
      success: true,
      data: body
    }
  } catch (err) {
    if (err.isBoom) {
      statusCode = err.output.statusCode
      body = {
        success: false,
        message: err.message,
        ...(err.data ? { data: err.data } : {})
      }
    } else {
      console.error(`Error occurred: ${err.message as string}`)
      console.error(err.stack)
      statusCode = 500
      body = {
        success: false,
        message: 'Internal Server Error'
      }
    }
  }
  return {
    statusCode,
    headers,
    body: body ? JSON.stringify(body) : body
  }
}
