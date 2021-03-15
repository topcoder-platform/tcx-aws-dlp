import axios, { AxiosRequestConfig } from 'axios'

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
    }
  }
  const res = await axios(requestConfig)
  return res.data as PresidioRes
}
