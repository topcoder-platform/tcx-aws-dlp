import axios, { AxiosRequestConfig } from 'axios'
import https from 'https'

const httpsAgent = new https.Agent({ rejectUnauthorized: false })

/**
 * Presidio Analyze Response item
 */
export interface PresidioItem {
  start: number
  end: number
  score: number
  entity_type: number
}

/**
 * Presidio Analyze response, an array of PresidioItems
 */
export type PresidioRes = PresidioItem[] | null

/**
 * Calls the Presidio API to analyze input text
 * @param dataString input text
 */
export async function identifyPII (dataString: string): Promise<PresidioRes> {
  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: process.env.PRESIDIO_ENDPOINT,
    data: {
      text: dataString,
      language: 'en'
    },
    headers: {
      Host: 'tcx-presidio.svc'
    },
    httpsAgent
  }
  const res = await axios.request<PresidioRes>(requestConfig)
  return res.data
}
