import Boom from '@hapi/boom'
import * as aws from 'aws-lambda'

import { getItem } from '../models/AdoWorkItemsDlpStatus'

/**
 * Handles HTTP get event.
 * @param event
 * @param context
 */
export default async function handleGetRequest (event: aws.APIGatewayEvent, context: aws.Context) {
  const projectId = event.queryStringParameters?.project_id
  if (!projectId) {
    throw Boom.badRequest('project_id is required')
  }
  const resourceId = event.queryStringParameters?.resource_id
  if (!resourceId) {
    throw Boom.badRequest('resource_id is required')
  }
  return await getItem(projectId, resourceId)
}
