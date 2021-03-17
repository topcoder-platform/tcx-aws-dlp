import * as aws from 'aws-lambda'
import { createHash } from 'crypto'

/**
 * Handles HTTP get event.
 * @param event
 * @param context
 */
export default async function handleGetRequest(event: aws.APIGatewayEvent, context: aws.Context) {
  const handshakeRequestData = event.headers['x-handshake-request-data']
  if (!handshakeRequestData) {
    return {}
  }
  const digest = createHash('sha256').update(handshakeRequestData).digest('hex')
  const responseHeaders = { 'x-handshake-response-data': digest }
  return responseHeaders
}
