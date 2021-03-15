import dynamoose from 'dynamoose'
import { Document } from 'dynamoose/dist/Document'

// TYPES
export enum DlpStatus {
  UNSCANNED = 'UNSCANNED',
  NO_ISSUES = 'NO_ISSUES',
  ISSUES_FOUND = 'ISSUES_FOUND',
  OVERRIDE = 'OVERRIDE'
}

export enum StatusFields {
  Title = 'titleStatus',
  Details = 'detailsStatus',
  AcceptanceCriteria = 'acceptanceCriteriaStatus',
  ReproductionSteps = 'reproductionStepsStatus',
  Description = 'descriptionStatus',
  SystemInfo = 'systemInfoStatus',
  Analysis = 'analysisStatus'
}

interface IStatusField {
  status: DlpStatus
  issues: Array<{
    _id?: string
    score: number
    text: string
  }>
}

/**
 * The DlpStatusItem document definition.
 */
export class DlpStatusItem extends Document {
  projectId: string
  resourceId: string
  dlpStatus: DlpStatus
  [StatusFields.Title]: IStatusField
  [StatusFields.Details]: IStatusField
  [StatusFields.AcceptanceCriteria]: IStatusField
  [StatusFields.ReproductionSteps]: IStatusField
  [StatusFields.Description]: IStatusField
  [StatusFields.SystemInfo]: IStatusField
  [StatusFields.Analysis]: IStatusField
}

/**
 * DlpStatus model name
 */
const modelName = 'AdoWorkItemsDlpStatus'

/**
 * DlpStatus Schema definition
 */
const schemaDefinition = {
  projectId: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
    hashKey: true
  },
  resourceId: {
    type: String,
    trim: true,
    required: true,
    minLength: 1,
    rangeKey: true
  },
  dlpStatus: {
    type: String,
    enum: Object.values(DlpStatus),
    required: true,
    default: DlpStatus.UNSCANNED
  },
  ...(Object.values(StatusFields).reduce((acc, val) => {
    acc[val] = {
      type: Object,
      schema: {
        status: {
          type: String,
          enum: Object.values(DlpStatus),
          required: true,
          default: DlpStatus.UNSCANNED
        },
        issues: {
          type: Array,
          schema: [{
            type: Object,
            schema: {
              _id: String,
              score: Number,
              text: String
            }
          }]
        }
      }
    }
    return acc
  }, {}))
}

/**
 * Schema settings
 */
const schemaSettings = {
  timestamps: false
}

// Initializes DynamoDB Schema
const DlpStatusSchema = new dynamoose.Schema(schemaDefinition, schemaSettings)
// Defines the model
const DlpStatusItemModel = dynamoose.model<DlpStatusItem>(modelName, DlpStatusSchema)

/**
 * Creates/Gets an item using the ADO Project ID and the Resource ID for an ADO Workitem
 * @param projectId ADO Project ID
 * @param resourceId ADO Workitem's Resource ID
 */
export async function getItem (projectId: string, resourceId: string): Promise<DlpStatusItem> {
  const item = {
    projectId: projectId,
    resourceId: resourceId.toString(),
    dlpStatus: DlpStatus.UNSCANNED,
    [StatusFields.Title]: { status: DlpStatus.UNSCANNED, issues: [] },
    [StatusFields.AcceptanceCriteria]: { status: DlpStatus.UNSCANNED, issues: [] },
    [StatusFields.Analysis]: { status: DlpStatus.UNSCANNED, issues: [] },
    [StatusFields.Description]: { status: DlpStatus.UNSCANNED, issues: [] },
    [StatusFields.Details]: { status: DlpStatus.UNSCANNED, issues: [] },
    [StatusFields.ReproductionSteps]: { status: DlpStatus.UNSCANNED, issues: [] },
    [StatusFields.SystemInfo]: { status: DlpStatus.UNSCANNED, issues: [] }
  }
  try {
    return await DlpStatusItemModel.create(item)
  } catch (err) {
    return await DlpStatusItemModel.get({ projectId, resourceId: resourceId.toString() })
  }
}

/**
 * Clears the record for a DLP Item
 * @param dlpStatusItem DB Record for DLP Status
 */
export async function setNoErrors (dlpStatusItem: DlpStatusItem): Promise<DlpStatusItem> {
  for (const field of Object.values(StatusFields)) {
    dlpStatusItem[field].issues = []
    dlpStatusItem[field].status = DlpStatus.NO_ISSUES
  }
  dlpStatusItem.dlpStatus = DlpStatus.NO_ISSUES
  const record = await dlpStatusItem.save()
  return record as DlpStatusItem
}
